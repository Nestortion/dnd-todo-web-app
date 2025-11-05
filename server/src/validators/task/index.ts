import { zValidator } from "@hono/zod-validator";
import { movetaskRequestSchema, taskRequestSchema } from "./schema";

const getTaskByIdValidator = zValidator("json", taskRequestSchema, (res, c) => {
  if (!res.success) return c.json(res.error, 400);
});

const createTaskValidator = zValidator("json", taskRequestSchema, (res, c) => {
  if (!res.success) return c.json(res.error, 400);
});

const moveTaskValidator = zValidator(
  "json",
  movetaskRequestSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export { getTaskByIdValidator, createTaskValidator, moveTaskValidator };
