// import express from "express";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import cors from "cors";

// import sequelize from "./config/db";
// import User from "./models/User";
// import authRoutes from "./routes/authRoutes";
// import contactRoutes from "./routes/contactRoutes";

// /* =======================
//    ENV CONFIG
// ======================= */
// dotenv.config();

// /* =======================
//    EXPRESS APP
// ======================= */
// const app = express();

// /* =======================
//    CORS CONFIG (EXPRESS 5 SAFE)
// ======================= */
// const getAllowedOrigins = () => {
//   const origins: string[] = [
//     "http://localhost:3000",
//     "http://127.0.0.1:3000",
//     "http://localhost:5173",
//   ];

//   if (process.env.FRONTEND_URL) {
//     origins.push(process.env.FRONTEND_URL);
//   }

//   if (process.env.RAILWAY_STATIC_URL) {
//     origins.push(process.env.RAILWAY_STATIC_URL);
//   }

//   return origins;
// };

// const corsOptions: cors.CorsOptions = {
//   origin: (origin, callback) => {
//     // Allow Postman / curl / server-to-server
//     if (!origin) {
//       return callback(null, true);
//     }

//     const allowedOrigins = getAllowedOrigins();

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     // Development → allow all
//     if (process.env.NODE_ENV === "development") {
//       console.warn(`⚠️  Dev CORS allowed: ${origin}`);
//       return callback(null, true);
//     }

//     // Production → block
//     console.error(`🚫 CORS blocked: ${origin}`);
//     return callback(new Error("Not allowed by CORS"), false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// /* =======================
//    MIDDLEWARES
// ======================= */
// app.use(cors(corsOptions)); // ✅ THIS IS ENOUGH (NO app.options("*"))
// app.use(express.json());

// /* =======================
//    ROUTES
// ======================= */
// app.use("/api/auth", authRoutes);
// app.use("/api/contacts", contactRoutes);

// /* =======================
//    HEALTH CHECK
// ======================= */
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "healthy",
//     environment: process.env.NODE_ENV || "development",
//     timestamp: new Date(),
//     corsAllowedOrigins: getAllowedOrigins(),
//   });
// });

// /* =======================
//    CORS TEST
// ======================= */
// app.get("/api/cors-test", (req, res) => {
//   res.json({
//     message: "CORS working",
//     origin: req.headers.origin || "No origin",
//     environment: process.env.NODE_ENV || "development",
//   });
// });

// /* =======================
//    ROOT
// ======================= */
// app.get("/", (req, res) => {
//   res.json({
//     message: "Contact Management API",
//     version: "1.0.0",
//   });
// });

// /* =======================
//    CREATE ADMIN (ONE TIME)
// ======================= */
// const createAdminIfNotExists = async () => {
//   try {
//     const adminEmail = "kiransoundarrajan@gmail.com";

//     const admin = await User.findOne({
//       where: { email: adminEmail },
//     });

//     if (!admin) {
//       const hashedPassword = await bcrypt.hash("1234567890", 10);

//       await User.create({
//         username: "Nakkeeran S",
//         email: adminEmail,
//         password: hashedPassword,
//         role: "admin",
//       });

//       console.log("✅ Admin user created");
//     } else {
//       console.log("ℹ️ Admin already exists");
//     }
//   } catch (error) {
//     console.error("❌ Admin creation failed:", error);
//   }
// };

// /* =======================
//    START SERVER
// ======================= */
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log("✅ Database synced");

//     console.log("🌍 Allowed CORS Origins:", getAllowedOrigins());
//     console.log("🚦 Environment:", process.env.NODE_ENV || "development");

//     await createAdminIfNotExists();

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
//     });
//   } catch (error) {
//     console.error("❌ Server failed to start:", error);
//   }
// };

// startServer();



import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";

import sequelize from "./config/db";
import User from "./models/User";
import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoutes";

/* =======================
   ENV CONFIG
======================= */
dotenv.config();

/* =======================
   APP INIT
======================= */
const app = express();

/* =======================
   CORS CONFIG
======================= */
const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }

  return origins;
};

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (getAllowedOrigins().includes(origin)) return cb(null, true);

    if (process.env.NODE_ENV === "development") {
      return cb(null, true);
    }

    return cb(new Error("CORS blocked"), false);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    env: process.env.NODE_ENV,
    time: new Date()
  });
});

/* =======================
   CREATE ADMIN (ONE TIME)
======================= */
const createAdminIfNotExists = async () => {
  const email = "kiransoundarrajan@gmail.com";

  const admin = await User.findOne({ where: { email } });

  if (!admin) {
    const hashed = await bcrypt.hash("1234567890", 10);

    await User.create({
      username: "Nakkeeran S",
      email,
      password: hashed,
      role: "admin"
    });

    console.log("✅ Admin created");
  }
};

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync(); // ❗ NO alter:true
    console.log("✅ DB connected");

    await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server start failed:", err);
  }
})();
