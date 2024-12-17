import {
  Message,
  MessageStatus,
  MessageType,
  IMessage,
} from "../models/message";
import { User } from "../models/user";
import { sendEmail } from "./email-service";

const MAX_ATTEMPTS = 3;
const PROCESSING_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const CONCURRENT_PROCESSING = 100; // Process 100 messages at a time

export async function processScheduledMessages(): Promise<void> {
  const now = new Date();

  // Get messages that will be processed now
  const messages = await Message.find({
    status: MessageStatus.SCHEDULED,
    scheduledFor: { $lte: now },
    $or: [
      { processingStarted: null },
      {
        processingStarted: {
          $lte: new Date(now.getTime() - PROCESSING_TIMEOUT),
        },
      },
    ],
  }).sort({ scheduledFor: 1 }); // Sort by oldest first

  // Split them in chunks of 100, and process them in parallel
  for (let i = 0; i < messages.length; i += CONCURRENT_PROCESSING) {
    const chunk = messages.slice(i, i + CONCURRENT_PROCESSING);
    await Promise.all(
      chunk.map(async (message) => {
        // Try to acquire lock atomically
        const lockedMessage = await Message.findOneAndUpdate(
          {
            _id: message._id,
            status: MessageStatus.SCHEDULED, // Must still be scheduled
            $or: [
              { processingStarted: null },
              { processingStarted: message.processingStarted }, // Must not have been taken by another process
            ],
          },
          {
            $set: {
              status: MessageStatus.PROCESSING,
              processingStarted: new Date(),
            },
          },
          { new: true }
        );

        if (lockedMessage) {
          await processMessage(lockedMessage);
        }
      })
    );
  }
}

async function processMessage(message: IMessage): Promise<void> {
  try {
    const user = await User.findById(message.userId);
    if (!user) {
      await Message.findOneAndUpdate(
        { _id: message._id, status: MessageStatus.PROCESSING },
        {
          $set: {
            status: MessageStatus.FAILED,
            error: "User not found",
            processingStarted: null,
          },
        }
      );
      return;
    }

    await sendEmail({
      to: user.email,
      message: `Hey, ${user.firstName} ${user.lastName} it's your birthday`,
    });

    // Message already sent, mark them
    await Message.findOneAndUpdate(
      { _id: message._id, status: MessageStatus.PROCESSING },
      {
        $set: {
          status: MessageStatus.SENT,
          processingStarted: null,
        },
      }
    );

    // Add new message for next year
    const nextYear = new Date(message.scheduledFor);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    try {
      await Message.create({
        userId: user._id,
        type: MessageType.BIRTHDAY,
        status: MessageStatus.SCHEDULED,
        scheduledFor: nextYear,
      });
    } catch (error: any) {
      // If duplicate, meaning already scheduled one, no need to do anything
      if (error.code !== 11000) {
        throw error;
      }
    }
  } catch (error: any) {
    const nextAttempt =
      message.attemptCount + 1 < MAX_ATTEMPTS
        ? new Date(
            Date.now() + Math.pow(2, message.attemptCount) * 5 * 60 * 1000
          )
        : null;

    await Message.findOneAndUpdate(
      { _id: message._id, status: MessageStatus.PROCESSING },
      {
        $inc: { attemptCount: 1 },
        $set: {
          status:
            message.attemptCount + 1 >= MAX_ATTEMPTS
              ? MessageStatus.FAILED
              : MessageStatus.SCHEDULED,
          error: error instanceof Error ? error.message : "Unknown error",
          nextAttempt,
          processingStarted: null,
        },
      }
    );
  }
}
export async function retryFailedMessages(): Promise<void> {
  const messages = await Message.find({
    status: MessageStatus.FAILED,
    attemptCount: { $lt: MAX_ATTEMPTS },
  });

  for (const message of messages) {
    await processMessage(message);
  }
}
