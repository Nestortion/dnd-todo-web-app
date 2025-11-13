import z from "zod";
import { picResponseSchema } from "../pic/schema";

export const taskRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  picId: z.number().optional(),
});

export const movetaskRequestSchema = z.object({
  taskId: z.number(),
  status: z.union([
    z.literal("Backlog"),
    z.literal("In Progress"),
    z.literal("Completed"),
    z.literal("For Testing"),
    z.literal("Finished"),
  ]),
});

export const assignTaskRequestSchema = z.object({
  taskId: z.number(),
  picId: z.number(),
});

export const taskResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  pic: picResponseSchema.optional(),
  dateCreated: z.date(),
  dateCompleted: z.date().optional(),
  isDeleted: z.boolean(),
  status: z.union([
    z.literal("Backlog"),
    z.literal("In Progress"),
    z.literal("Completed"),
    z.literal("For Testing"),
    z.literal("Finished"),
  ]),
});

export const taskIdParamSchema = z.object({ id: z.number() });

export type Task = z.infer<typeof taskResponseSchema>;
export type AssignTaskRequest = z.infer<typeof assignTaskRequestSchema>;
export type MoveTaskRequest = z.infer<typeof movetaskRequestSchema>;
export type CreateTaskRequest = z.infer<typeof taskRequestSchema>;
