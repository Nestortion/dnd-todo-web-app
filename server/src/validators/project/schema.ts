import z from "zod";

export const createProjectSchema = z.object({
  projectName: z.string(),
  description: z.string(),
});
