import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OrderStatus extends Document {
  @Prop() collect_id: string;       // reference to Order._id
  @Prop() order_amount: number;
  @Prop() transaction_amount: number;
  @Prop() payment_mode: string;
  @Prop() payment_details: string;
  @Prop() bank_reference: string;
  @Prop() payment_message: string;
  @Prop() status: string;
  @Prop() error_message: string;
  @Prop() payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
