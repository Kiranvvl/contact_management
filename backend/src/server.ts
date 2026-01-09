import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import User from "./models/User";

import sequelize from "./config/db";
import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoutes";

dotenv.config();

const app = express();

/* ======================
   CORS CONFIG (FIXED)
====================== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "https://contact-manager-97.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

/* ======================
   HEALTH CHECK
====================== */
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

/* ======================
   ROOT
====================== */
app.get("/", (req, res) => {
  res.json({
    message: "Contact Management API",
    version: "1.0.0",
  });
});

const PORT = process.env.PORT || 5000;

/* ======================
   CREATE ADMIN
====================== */
const createAdminIfNotExists = async () => {
  try {
    const adminEmail = "kiransoundarrajan@gmail.com";
    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("1234567890", 10);

      await User.create({
        username: "Nakkeeran S",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Admin creation failed:", err);
  }
};

/* ======================
   START SERVER
====================== */
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced");

    await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed:", error);
  }
};

startServer();
