import type { TaskStatus } from "./contants";

export type TaskPayLoad = {
  title: string;
  description: string;
  picId?: number;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  dateCreated: Date;
  dateCompleted?: Date;
  pic: PIC;
  isDeleted: boolean;
  status: TaskStatus;
};

export type PIC = {
  id: number;
  name: string;
  tableId: number;
  seatNumber: number;
  profileImage?: string;
};
