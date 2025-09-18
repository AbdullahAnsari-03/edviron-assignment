// CREATE NEW FILE: src/schemas/webhook-logs.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WebhookLog extends Document {
  @Prop({ required: true })
  webhook_id: string;

  @Prop({ required: true })
  event_type: string;

  @Prop({ type: Object, required: true })
  payload: any;

  @Prop({ required: true })
  status: string; // 'success', 'failed'

  @Prop()
  error_message: string;

  @Prop({ default: Date.now })
  received_at: Date;

  @Prop()
  processed_at: Date;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);