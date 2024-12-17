import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";
import { Message } from "../../models/message";

describe("User Routes", () => {
  const validUser = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    birthday: "1990-01-15",
    timezone: "America/New_York",
  };

  describe("POST /user", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/user").send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
      });
    });
  });
});
