import { zValidator } from "@hono/zod-validator";
import { createPicSchema } from "./schema";

export const createPicValidator = zValidator(
  "json",
  createPicSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);
