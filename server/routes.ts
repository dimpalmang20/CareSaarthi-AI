import type { Express } from "express";
import type { Server } from "http";
import { db } from "./db";
import { users, medicines, orders } from "../shared/schema";
import { eq } from "drizzle-orm";


export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // =============================
  // USER REGISTER API
  // =============================
  app.post("/api/register", async (req, res) => {
    const { name, email, phone, address, password } = req.body;

    try {
      await db.insert(users).values({
        name,
        email,
        phone,
        address,
        password,
      });

      res.json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "User already exists" });
    }
  });

  // =============================
  // USER LOGIN API
  // =============================
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await db.select().from(users).where(eq(users.email, email));

    if (!user.length || user[0].password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user[0]);
  });

  // =============================
  // ADD MEDICINE API
  // =============================
  app.post("/api/add-medicine", async (req, res) => {
    const { name, stock, price, unitType, prescriptionRequired } = req.body;

    await db.insert(medicines).values({
      name,
      stock,
      price,
      unitType,
      prescriptionRequired,
    });

    res.json({ message: "Medicine added successfully" });
  });

  // =============================
  // GET MEDICINES API
  // =============================
  app.get("/api/medicines", async (req, res) => {
    const meds = await db.select().from(medicines);
    res.json(meds);
  });

  // =============================
  // PLACE ORDER API (Safety engine)
  // =============================
  app.post("/api/order", async (req, res) => {
    const { userId, medicineName, quantity } = req.body;

    const med = await db
      .select()
      .from(medicines)
      .where(eq(medicines.name, medicineName));

    if (!med.length)
      return res.status(404).json({ message: "Medicine not found" });

    if (med[0].stock < quantity)
      return res.status(400).json({ message: "Out of stock" });

    const totalPrice = med[0].price * quantity;

    await db.insert(orders).values({
      userId,
      medicineName,
      quantity,
      totalPrice,
    });

    // reduce stock
    await db
      .update(medicines)
      .set({ stock: med[0].stock - quantity })
      .where(eq(medicines.name, medicineName));

    res.json({ message: "Order placed successfully" });
  });

  return httpServer;
}
