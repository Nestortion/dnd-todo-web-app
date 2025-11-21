import { zValidator } from "@hono/zod-validator";
import {
  createPicSchema,
  getAllQuerySchema,
  getTablePicSchema,
  getUnassignedPicSchema,
  movePicSchema,
  picIdParamSchema,
} from "./schema";

export const createPicValidator = zValidator(
  "json",
  createPicSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const picIdParamValidator = zValidator(
  "param",
  picIdParamSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const getAllQueryValidator = zValidator(
  "query",
  getAllQuerySchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const getTablePicQueryValidator = zValidator(
  "param",
  getTablePicSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const getUnassignedPicQueryValidator = zValidator(
  "param",
  getUnassignedPicSchema,
  (res, c) => {
    if (!res.success) return c.json(res.error, 400);
  },
);

export const movePicValidator = zValidator("json", movePicSchema, (res, c) => {
  if (!res.success) return c.json(res.error, 400);
});
