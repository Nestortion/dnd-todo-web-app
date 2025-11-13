import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
} from "drizzle-orm/mysql-core";
import { picsTable } from "./pic";

export const tasksTable = mysqlTable("tasks", {
  id: int().autoincrement().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  picId: int("pic_id").references(() => picsTable.id),
  createDate: datetime("create_date", { mode: "string" }).default(sql`now()`),
  completeDate: datetime("complete_date"),
  dueDate: datetime("due_date"),
  isDeleted: boolean("is_deleted").default(false),
  status: mysqlEnum([
    "Backlog",
    "In Progress",
    "Completed",
    "For Testing",
    "Reject",
    "Finished",
  ])
    .default("Backlog")
    .notNull(),
});

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  pic: one(picsTable, {
    fields: [tasksTable.picId],
    references: [picsTable.id],
  }),
}));
