import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  picId: z.number().optional(),
});
