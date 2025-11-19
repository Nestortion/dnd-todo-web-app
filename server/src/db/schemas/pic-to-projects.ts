import { int, mysqlTable, unique } from "drizzle-orm/mysql-core";
import { picsTable } from "./pic";
import { relations } from "drizzle-orm";
import { projectsTable } from "./project";

export const picToProjectsTables = mysqlTable(
  "pic_to_projects",
  {
    id: int().autoincrement().primaryKey(),
    picId: int("pic_id")
      .notNull()
      .references(() => picsTable.id, { onUpdate: "cascade" }),
    projectId: int("project_id")
      .notNull()
      .references(() => projectsTable.id, { onUpdate: "cascade" }),
  },
  (table) => [unique().on(table.picId, table.projectId)],
);

export const picToProjectsRelations = relations(
  picToProjectsTables,
  ({ one }) => ({
    pic: one(picsTable, {
      fields: [picToProjectsTables.picId],
      references: [picsTable.id],
    }),
    project: one(projectsTable, {
      fields: [picToProjectsTables.projectId],
      references: [projectsTable.id],
    }),
  }),
);
