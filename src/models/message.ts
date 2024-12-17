import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export enum MessageStatus {
  SCHEDULED = "SCHEDULED",
  PROCESSING = "PROCESSING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export enum MessageType {
  BIRTHDAY = "BIRTHDAY",
  // Extensible for future message types
}

export interface IMessage extends Document {
  userId: IUser["_id"];
  type: MessageType;
  status: MessageStatus;
  scheduledFor: Date;
  attemptCount: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  processingStarted?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(MessageType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      required: true,
      default: MessageStatus.SCHEDULED,
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    lastAttempt: {
      type: Date,
    },
    nextAttempt: {
      type: Date,
    },
    processingStarted: {
      type: Date,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index
messageSchema.index({ userId: 1, type: 1, scheduledFor: 1 }, { unique: true });
messageSchema.index({ status: 1, scheduledFor: 1, nextAttempt: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
