import type z from "zod";
import type { taskResponseSchema } from "./src/validators/task/schema";
import type { picResponseSchema } from "./src/validators/pic/schema";

type Data = Array<z.infer<typeof taskResponseSchema>>;

let data: Data = [];

export const setData = (newData: Data) => {
  data = newData;
};
export const getData = () => {
  return data;
};

type PICList = Array<z.infer<typeof picResponseSchema>>;

let picList: PICList = [];

export const setPicList = (newList: PICList) => {
  picList = newList;
};
export const getPicList = () => {
  return picList;
};
