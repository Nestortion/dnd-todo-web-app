import { zValidator } from "@hono/zod-validator";
import { createProjectSchema } from "./schema";

export const createProjectRequestValidator = zValidator(
  "json",
  createProjectSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);
