import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  school_id: string;

  // ADD THESE MISSING FIELDS:
  @Prop({ required: true })
  trustee_id: string;
  @Prop({
    type: {
      name: { type: String, required: true },
      id: { type: String, required: true },
      email: { type: String, required: true }
    },
    required: true
  })
  student_info: {
    name: string;
    id: string;
    email: string;
  };

  @Prop()
  gateway_name: string;

  // Keep your existing fields:
  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  collect_request_id: string;

  @Prop({ required: true })
  collect_request_url: string;

  @Prop({ default: 'PENDING' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
