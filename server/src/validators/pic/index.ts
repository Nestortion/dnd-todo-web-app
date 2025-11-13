import { zValidator } from "@hono/zod-validator";
import { createPicSchema, movePicSchema } from "./schema";
import { taskIdParamSchema } from "../task/schema";

export const createPicValidator = zValidator(
  "json",
  createPicSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const picIdParamValidator = zValidator(
  "param",
  taskIdParamSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const movePicValidator = zValidator("json", movePicSchema, (res, c) => {
  if (!res.success) return c.json(res.error, 400);
});
