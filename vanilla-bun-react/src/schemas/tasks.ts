import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  projectId: z.number(),
  picId: z.number().optional(),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
