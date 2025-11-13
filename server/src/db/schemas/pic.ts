import {
  boolean,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const picsTable = mysqlTable("pics", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  tableId: int("table_id").notNull(),
  seatNumber: int("seat_number").notNull(),
  profileImage: text("profile_image"),
  isDeleted: boolean("is_deleted").default(false),
});
