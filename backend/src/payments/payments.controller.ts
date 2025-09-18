import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-payment')
    @UseGuards(JwtAuthGuard)
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.createPayment(createPaymentDto);
    }

    @Post('webhook')
    async handleWebhook(@Body() payload: any) {
        return this.paymentsService.handleCallback(payload);
    }

    @Get('transactions')
    @UseGuards(JwtAuthGuard)
    async getTransactions(
        @Query('limit') limit: number,
        @Query('page') page: number,
        @Query('sort') sort: string,
        @Query('order') order: 'asc' | 'desc',
        @Query('status') status: string,
        @Query('school_id') school_id: string,
    ) {
        return this.paymentsService.getAllTransactions(
            limit || 20, 
            page || 1, 
            sort || 'payment_time', 
            order || 'desc',
            status,
            school_id
        );
    }

    @Get('transactions/school/:schoolId')
    @UseGuards(JwtAuthGuard)
    async getTransactionsBySchool(@Param('schoolId') schoolId: string) {
        return this.paymentsService.getTransactionsBySchool(schoolId);
    }

    @Get('transaction-status/:custom_order_id')
    @UseGuards(JwtAuthGuard)
    async getTransactionStatus(@Param('custom_order_id') custom_order_id: string) {
        return this.paymentsService.getTransactionStatus(custom_order_id);
    }
}