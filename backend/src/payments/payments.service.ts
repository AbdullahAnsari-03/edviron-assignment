// UPDATE: src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema'; // FIXED PATH
import { OrderStatus } from './schemas/order-status.schema'; // FIXED PATH
import { WebhookLog } from './schemas/webhook-logs.schema'; // FIXED PATH

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private readonly orderStatusModel: Model<OrderStatus>,
    @InjectModel(WebhookLog.name) private readonly webhookLogModel: Model<WebhookLog>,
  ) {}

  /** Create a new payment request */
  async createPayment(data: {
    school_id: string;
    amount: string;
    trustee_id: string;
    student_info: { name: string; id: string; email: string };
    gateway_name?: string;
  }) {
    const payload = { 
      school_id: data.school_id, 
      amount: data.amount, 
      callback_url: process.env.CALLBACK_URL 
    };
    const sign = jwt.sign(payload, process.env.PG_KEY as string);

    const { data: response } = await axios.post(
      'https://dev-vanilla.edviron.com/erp/create-collect-request',
      { ...payload, sign },
      { 
        headers: { 
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`, 
          'Content-Type': 'application/json' 
        } 
      },
    );

    const order = new this.orderModel({
      school_id: data.school_id,
      trustee_id: data.trustee_id,
      student_info: data.student_info,
      gateway_name: data.gateway_name || 'Default',
      amount: data.amount,
      collect_request_id: response.collect_request_id,
      collect_request_url: response.collect_request_url || response.Collect_request_url,
      status: 'PENDING',
    });
    await order.save();

    const orderStatus = new this.orderStatusModel({
      collect_id: response.collect_request_id,
      order_amount: Number(data.amount),
      transaction_amount: 0,
      payment_mode: '',
      payment_details: '',
      bank_reference: '',
      payment_message: '',
      status: 'PENDING',
      error_message: '',
      payment_time: null,
    });
    await orderStatus.save();

    return {
      collect_request_id: response.collect_request_id,
      collect_request_url: response.collect_request_url,
      sign: response.sign,
    };
  }

  /** Handle payment gateway callback with logging */
  async handleCallback(payload: any) {
    const webhookLog = new this.webhookLogModel({
      webhook_id: payload.order_info?.order_id || 'unknown',
      event_type: 'payment_callback',
      payload,
      status: 'processing',
      received_at: new Date(),
    });

    try {
      const order_info = payload.order_info;

      const orderStatus = await this.orderStatusModel.findOneAndUpdate(
        { collect_id: order_info.order_id },
        {
          $set: {
            transaction_amount: order_info.transaction_amount,
            payment_mode: order_info.payment_mode,
            payment_details: order_info.payment_details,
            bank_reference: order_info.bank_reference,
            payment_message: order_info.payment_message,
            status: order_info.status,
            error_message: order_info.error_message,
            payment_time: new Date(order_info.payment_time),
          },
        },
        { new: true },
      );

      await this.orderModel.updateOne(
        { collect_request_id: order_info.order_id },
        { $set: { status: order_info.status } },
      );

      // Update webhook log as successful
      webhookLog.status = 'success';
      webhookLog.processed_at = new Date();
      await webhookLog.save();

      return { message: 'Callback processed', updatedOrderStatus: orderStatus };
    } catch (error) {
      // Log failed webhook
      webhookLog.status = 'failed';
      webhookLog.error_message = error.message;
      webhookLog.processed_at = new Date();
      await webhookLog.save();
      throw error;
    }
  }

  /** Fetch all transactions with pagination, sorting, and filtering */
  async getAllTransactions(
    limit = 20, 
    page = 1, 
    sortField = 'payment_time', 
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: string,
    school_id?: string
  ) {
    const skip = (page - 1) * limit;
    
    // Build match conditions for filtering
    const matchConditions: any = {};
    if (status) matchConditions.status = status;
    if (school_id) matchConditions['order.school_id'] = school_id;

    const pipeline: any[] = [
      { $lookup: { from: 'orders', localField: 'collect_id', foreignField: 'collect_request_id', as: 'order' } },
      { $unwind: '$order' },
    ];

    // Add match stage if there are filters
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push(
      { $project: { 
          collect_id: 1, 
          school_id: '$order.school_id', 
          gateway: '$order.gateway_name', 
          order_amount: 1, 
          transaction_amount: 1, 
          status: 1, 
          custom_order_id: '$collect_id', 
          payment_time: 1,
          createdAt: '$order.createdAt',
           student_info: '$order.student_info',
        } 
      },
      { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    return this.orderStatusModel.aggregate(pipeline);
  }

  /** Other methods remain the same */
 async getTransactionsBySchool(school_id: string) {
  return this.orderStatusModel.aggregate([
    { $lookup: { from: 'orders', localField: 'collect_id', foreignField: 'collect_request_id', as: 'order' } },
    { $unwind: '$order' },
    { $match: { 'order.school_id': school_id } },
    { 
      $project: { 
        collect_id: 1, 
        school_id: '$order.school_id', 
        gateway: '$order.gateway_name', 
        order_amount: 1, 
        transaction_amount: 1, 
        status: 1, 
        custom_order_id: '$collect_id', 
        payment_time: 1,
        student_info: '$order.student_info'  // <-- add this
      } 
    },
  ]);
}


  async getTransactionStatus(custom_order_id: string) {
    const status = await this.orderStatusModel.findOne({ collect_id: custom_order_id }).select({
      collect_id: 1,
      order_amount: 1,
      transaction_amount: 1,
      status: 1,
      payment_time: 1,
      _id: 0,
    });

    if (!status) {
      return { message: 'Transaction not found' };
    }

    return status;
  }
}