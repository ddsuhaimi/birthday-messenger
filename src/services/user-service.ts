import { User, IUser } from "../models/user";
import { Message, MessageType, MessageStatus } from "../models/message";
import { AppError } from "../middleware/error-handler";
import { getNextBirthdayDate } from "../utils/date-utils";

interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  timezone: string;
}

interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthday?: Date;
  timezone?: string;
}

export async function createUser(userData: CreateUserDto): Promise<IUser> {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(400, "User with this email already exists");
  }

  const user = await User.create(userData);

  // after creation, schedule their message
  await scheduleBirthdayMessage(user);

  return user;
}

export async function deleteUser(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Delete the user and their messages
  await Promise.all([
    User.deleteOne({ _id: userId }),
    Message.deleteMany({ userId }),
  ]);
}

async function scheduleBirthdayMessage(user: IUser): Promise<void> {
  const nextBirthday = getNextBirthdayDate(user.birthday, user.timezone);

  await Message.create({
    userId: user._id,
    type: MessageType.BIRTHDAY,
    status: MessageStatus.SCHEDULED,
    scheduledFor: nextBirthday,
  });
}

export async function updateUser(
  userId: string,
  userData: UpdateUserDto
): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // If birthday or timezone is being updated, we need to reschedule the birthday message
  const needsReschedule = userData.birthday || userData.timezone;

  // Update user
  Object.assign(user, userData);
  await user.save();

  if (needsReschedule) {
    // Delete their current scheduled message
    await Message.deleteMany({
      userId: user._id,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
    });

    // Schedule message
    await scheduleBirthdayMessage(user);
  }

  return user;
}
