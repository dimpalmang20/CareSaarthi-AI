import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

/* USERS TABLE */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  password: text("password").notNull(),
});

/* MEDICINES TABLE */
export const medicines = pgTable("medicines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  stock: integer("stock").notNull(),
  price: integer("price").notNull(),
  unitType: text("unit_type").notNull(),
  prescriptionRequired: boolean("prescription_required").notNull(),
});

/* ORDERS TABLE */
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  medicineName: text("medicine_name").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").default("Placed"),
  createdAt: timestamp("created_at").defaultNow(),
});
