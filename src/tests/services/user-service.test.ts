import {
  createUser,
  deleteUser,
  updateUser,
} from "../../services/user-service";
import { User } from "../../models/user";
import { Message } from "../../models/message";
import { AppError } from "../../middleware/error-handler";

describe("User Service", () => {
  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    birthday: new Date("1990-01-01"),
    timezone: "America/New_York",
  };

  describe("createUser", () => {
    it("should create a new user with scheduled birthday message", async () => {
      const user = await createUser(mockUser);

      expect(user.email).toBe(mockUser.email);

      // Verify birthday message was scheduled
      const message = await Message.findOne({ userId: user._id });
      expect(message).toBeTruthy();
    });

    it("should throw error if email already exists", async () => {
      await createUser(mockUser);

      await expect(createUser(mockUser)).rejects.toThrow(AppError);
    });
  });

  describe("deleteUser", () => {
    it("should delete user and associated messages", async () => {
      const user = await createUser(mockUser);

      await deleteUser(user._id);

      const deletedUser = await User.findById(user._id);
      const messages = await Message.find({ userId: user._id });

      expect(deletedUser).toBeNull();
      expect(messages).toHaveLength(0);
    });
  });
});
