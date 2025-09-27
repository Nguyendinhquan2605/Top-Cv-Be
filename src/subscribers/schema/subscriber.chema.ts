import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SubscribersDocument = HydratedDocument<Subscribers>;

@Schema({ timestamps: true })
export class Subscribers {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  skills: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updateddAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const SubscribersSchema = SchemaFactory.createForClass(Subscribers);
