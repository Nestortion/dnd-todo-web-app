import z from "zod";

export const createProjectSchema = z.object({
  projectName: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
});

export type CreateProject = z.infer<typeof createProjectSchema>;
