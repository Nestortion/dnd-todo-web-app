import z from "zod";

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

export const taskResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  picId: z.number().optional(),
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
