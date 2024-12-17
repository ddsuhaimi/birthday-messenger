import { Router } from "express";
import { createUser, deleteUser, updateUser } from "../services/user-service";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../schemas/user-schema";

const router = Router();

router.post(
  "/",
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    const user = await createUser({
      ...req.body,
      birthday: new Date(req.body.birthday),
    });
    res.status(201).json(user);
  })
);

router.put(
  "/:userId",
  validate(updateUserSchema),
  asyncHandler(async (req, res) => {
    const user = await updateUser(req.params.userId, {
      ...req.body,
      birthday: req.body.birthday ? new Date(req.body.birthday) : undefined,
    });
    res.json(user);
  })
);

router.delete(
  "/:userId",
  asyncHandler(async (req, res) => {
    await deleteUser(req.params.userId);
    res.status(204).send();
  })
);

export { router as userRoutes };
