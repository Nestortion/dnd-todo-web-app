import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { projectsTable } from "./project";
import { picToSeatTables } from "./pic-to-seat-tables";

export const seatTablesTable = mysqlTable("seat_tables", {
  id: int().autoincrement().primaryKey(),
  tableName: varchar("table_name", { length: 255 }).notNull(),
  description: text(),
  createBy: varchar("create_by", { length: 255 }).notNull(),
  createDate: datetime("create_date", { mode: "string" }).default(sql`now()`),
  isDeleted: boolean("is_deleted").default(false),
  projectId: int("project_id")
    .references(() => projectsTable.id)
    .notNull(),
});

export const seatTablesRelations = relations(
  seatTablesTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [seatTablesTable.projectId],
      references: [projectsTable.id],
    }),
    picToSeatTables: many(picToSeatTables),
  }),
);
