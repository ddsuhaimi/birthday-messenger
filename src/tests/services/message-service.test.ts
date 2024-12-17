import {
  processScheduledMessages,
  retryFailedMessages,
} from "../../services/message-service";
import { Message, MessageStatus, MessageType } from "../../models/message";
import { User } from "../../models/user";
import * as emailService from "../../services/email-service";
import MockDate from "mockdate";
import mongoose from "mongoose";

// Mock the entire email-service module
jest.mock("../../services/email-service", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

describe("Message Service", () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    birthday: new Date("1990-01-01"),
    timezone: "America/New_York",
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    MockDate.reset();
    await User.create(mockUser);
  });

  describe("processScheduledMessages", () => {
    it("should process scheduled messages", async () => {
      // Set current time first
      const now = new Date("2024-01-01T09:00:00.000Z");
      MockDate.set(now);

      // Create message scheduled for a time before now
      const scheduledTime = new Date(now.getTime() - 1000); // 1 second before now
      await Message.create({
        userId: mockUser._id,
        type: MessageType.BIRTHDAY,
        status: MessageStatus.SCHEDULED,
        scheduledFor: scheduledTime,
        processingStarted: null,
        attemptCount: 0,
      });

      const createdMessage = await Message.findOne({ userId: mockUser._id });

      const mockSendEmail = jest.mocked(emailService.sendEmail);
      mockSendEmail.mockClear();

      await processScheduledMessages();

      const processedMessage = await Message.findOne({ userId: mockUser._id });

      expect(processedMessage?.status).toBe(MessageStatus.SENT);
    });
  });
});
