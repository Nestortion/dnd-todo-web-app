import z from "zod";

export const createPicSchema = z.object({
  name: z.string(),
  seatTableId: z.number(),
  seatNumber: z.number(),
  profileImage: z.string(),
  projectId: z.number(),
});

export const picResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  tableId: z.number(),
  seatNumber: z.number(),
  image: z.string(),
});

export const picIdParamSchema = z.object({ id: z.number() });

export const getAllQuerySchema = z.object({
  projectId: z.coerce.number().optional(),
  seatTableId: z.coerce.number().optional(),
});

export const getUnassignedPicSchema = z.object({
  projectId: z.coerce.number(),
});

export const movePicSchema = z.object({
  target: z
    .object({
      picId: z.number(),
      seatTableId: z.number(),
    })
    .optional(),
  current: z.object({
    picId: z.number(),
    seatTableId: z.number(),
  }),
  type: z.union([
    z.literal("assign"),
    z.literal("unassign"),
    z.literal("move"),
  ]),
});

export type PIC = z.infer<typeof picResponseSchema>;
export type MovePicRequestSchema = z.infer<typeof movePicSchema>;
export type CreatePicRequest = z.infer<typeof createPicSchema>;
