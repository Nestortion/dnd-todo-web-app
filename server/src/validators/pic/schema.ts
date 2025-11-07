import z from "zod";

export const createPicSchema = z.object({
  name: z.string(),
});

export const picResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});
