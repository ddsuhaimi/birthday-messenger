import axios from "axios";
import { config } from "../config";
import { AppError } from "../middleware/error-handler";

interface SendEmailParams {
  to: string;
  message: string;
}

export async function sendEmail({
  to,
  message,
}: SendEmailParams): Promise<void> {
  try {
    await axios.post(
      `${config.emailServiceUrl}/send-email`,
      {
        email: to,
        message,
      },
      {
        timeout: 10000,
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError(
        500,
        `Failed to send email: ${
          (error as any).response?.data?.message || (error as any).message
        }`
      );
    }
    throw error;
  }
}
