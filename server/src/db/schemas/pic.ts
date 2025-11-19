import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { tasksTable } from "./task";
import { projectsTable } from "./project";
import { picToSeatTables } from "./pic-to-seat-tables";
import { picToProjectsTables } from "./pic-to-projects";

export const picsTable = mysqlTable("pics", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  projectId: int("project_id")
    .references(() => projectsTable.id)
    .notNull(),
  seatNumber: int("seat_number"),
  profileImage: text("profile_image"),
  isDeleted: boolean("is_deleted").default(false),
});

export const picRelations = relations(picsTable, ({ one, many }) => ({
  tasks: many(tasksTable),
  project: one(projectsTable, {
    fields: [picsTable.projectId],
    references: [projectsTable.id],
  }),
  picToSeatTables: many(picToSeatTables),
  picToProjects: many(picToProjectsTables),
}));
