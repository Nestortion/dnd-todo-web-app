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
  picId?: number;
  isDeleted: boolean;
  status: TaskStatus;
};
