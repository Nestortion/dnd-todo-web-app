import type z from "zod";
import type { taskResponseSchema } from "./src/validators/task/schema";

type Data = Array<z.infer<typeof taskResponseSchema>>;

let data: Data = [];

export const setData = (newData: Data) => {
  data = newData;
};
export const getData = () => {
  return data;
};
