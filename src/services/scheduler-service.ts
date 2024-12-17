import cron from "node-cron";
import {
  processScheduledMessages,
  retryFailedMessages,
} from "./message-service";

export function startScheduler(): void {
  // Process scheduled messages every minute
  cron.schedule("* * * * *", async () => {
    try {
      await processScheduledMessages();
    } catch (error) {
      console.error("Error processing scheduled messages:", error);
    }
  });

  // Retry failed messages every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      await retryFailedMessages();
    } catch (error) {
      console.error("Error retrying failed messages:", error);
    }
  });
}
