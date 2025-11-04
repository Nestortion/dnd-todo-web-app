import z from "zod";

export const taskRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  picId: z.number().optional(),
});

export const taskResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  picId: z.number(),
  dateCreated: z.date(),
  dateCompleted: z.date(),
  isDeleted: z.boolean(),
});
