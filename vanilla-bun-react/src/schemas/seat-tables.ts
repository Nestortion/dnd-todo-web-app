import z from "zod";

export const createSeatTableSchema = z.object({
  tableName: z.string(),
  description: z.string(),
  projectId: z.number(),
});

export type CreateSeatTable = z.infer<typeof createSeatTableSchema>;
