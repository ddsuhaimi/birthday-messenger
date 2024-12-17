import { z } from "zod";
import moment from "moment-timezone";

const validTimezones = moment.tz.names();

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  birthday: z.string().refine((date) => {
    const parsed = moment(date);
    return parsed.isValid() && parsed.isBefore(moment());
  }, "Invalid birthday date. Must be a valid past date"),
  timezone: z
    .string()
    .refine(
      (tz) => validTimezones.includes(tz),
      "Invalid timezone. Must be a valid timezone by moment-timezone"
    ),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
