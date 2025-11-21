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
  seatNumber: number;
  profileImage?: string;
  seatTableId?: number;
};

export type PicTable = {
  id: number;
  tableName: string;
  description: string;
  createBy: string;
  createDate: Date;
};

export type Project = {
  id: number;
  projectName: string;
  description: string;
  createBy: string;
  createDate: Date;
};

export * from "./classes";
