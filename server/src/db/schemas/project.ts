import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { tasksTable } from "./task";
import { seatTablesTable } from "./seat-table";
import { picsTable } from "./pic";
import { picToProjectsTables } from "./pic-to-projects";

export const projectsTable = mysqlTable("projects", {
  id: int().autoincrement().primaryKey(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  description: text(),
  createBy: varchar("create_by", { length: 255 }).notNull(),
  createDate: datetime("create_date", { mode: "string" }).default(sql`now()`),
  isDeleted: boolean("is_deleted").default(false),
});

export const projectsRelations = relations(projectsTable, ({ many }) => ({
  tasks: many(tasksTable),
  seatTables: many(seatTablesTable),
  pics: many(picsTable),
  picToProjects: many(picToProjectsTables),
}));
