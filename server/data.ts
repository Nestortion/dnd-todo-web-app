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

let picList: PICList = [
  {
    id: 1,
    tableId: 1,
    seatNumber: 1,
    name: "Nestor Gerona",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 2,
    tableId: 1,
    seatNumber: 2,
    name: "Dave Valencia",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 3,
    tableId: 1,
    seatNumber: 3,
    name: "Denzell Loria",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 4,
    tableId: 2,
    seatNumber: 1,
    name: "Jason Labenia",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 5,
    tableId: 2,
    seatNumber: 2,
    name: "JC Streeter",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 6,
    tableId: 2,
    seatNumber: 3,
    name: "Red Custombrado",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 7,
    tableId: 3,
    seatNumber: 1,
    name: "Jon Pecayo",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 8,
    tableId: 3,
    seatNumber: 2,
    name: "Kim Parrenas",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 9,
    tableId: 3,
    seatNumber: 3,
    name: "Mary Ann Jomao-as",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 10,
    tableId: 4,
    seatNumber: 1,
    name: "Aaron Callalo",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 11,
    tableId: 4,
    seatNumber: 2,
    name: "Jen Raquin",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 12,
    tableId: 4,
    seatNumber: 3,
    name: "Juliet Lampa",
    image: "https://picsum.photos/200/300?grayscale",
  },
];

export const setPicList = (newList: PICList) => {
  picList = newList;
};
export const getPicList = () => {
  return picList;
};
