import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, ClothingItem, SwapRequest, Report } from "./models.js";

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || "development-only-change-me";

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

const sign = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, {
    expiresIn: "7d",
  });
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  location: user.location,
  role: user.role,
  rating: user.rating,
  responseRate: user.responseRate,
  successfulSwaps: user.successfulSwaps,
});

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required." });
  try {
    req.auth = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired." });
  }
}

function requireAdmin(req, res, next) {
  return req.auth?.role === "admin"
    ? next()
    : res.status(403).json({ message: "Admin access required." });
}
function validate(fields, body) {
  return fields.find((field) => !body[field] || String(body[field]).trim() === "");
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "homies-wear-api" }));

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const missing = validate(["name", "email", "password"], req.body);
    if (missing || req.body.password.length < 8)
      return res.status(400).json({
        message: "Please provide a name, email, and password of at least 8 characters.",
      });
    const email = req.body.email.toLowerCase().trim();
    if (await User.exists({ email }))
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    const user = await User.create({
      name: req.body.name,
      email,
      passwordHash: await bcrypt.hash(req.body.password, 12),
      location: req.body.location,
    });
    res.status(201).json({ token: sign(user), user: safeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email?.toLowerCase().trim(),
    });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash)))
      return res.status(401).json({ message: "Email or password is incorrect." });
    res.json({ token: sign(user), user: safeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    res.json({ user: safeUser(await User.findById(req.auth.id)) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/items", async (req, res, next) => {
  try {
    const query = { status: "available" };
    if (req.query.category && req.query.category !== "All pieces")
      query.category = req.query.category;
    if (req.query.search) query.$text = { $search: req.query.search };
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(40, Math.max(1, Number(req.query.limit) || 16));
    const [items, total] = await Promise.all([
      ClothingItem.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("ownerId", "name avatar location"),
      ClothingItem.countDocuments(query),
    ]);
    res.json({ items, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
});
app.get("/api/items/:id", async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.id).populate(
      "ownerId",
      "name avatar location rating responseRate successfulSwaps",
    );
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});
app.post("/api/items", requireAuth, async (req, res, next) => {
  try {
    const missing = validate(["title", "category"], req.body);
    if (missing) return res.status(400).json({ message: `Missing field: ${missing}` });
    res
      .status(201)
      .json(await ClothingItem.create({ ...req.body, ownerId: req.auth.id }));
  } catch (error) {
    next(error);
  }
});
app.put("/api/items/:id", requireAuth, async (req, res, next) => {
  try {
    const item = await ClothingItem.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.auth.id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});
app.delete("/api/items/:id", requireAuth, async (req, res, next) => {
  try {
    const item = await ClothingItem.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.auth.id },
      { status: "hidden" },
      { new: true },
    );
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/swaps", requireAuth, async (req, res, next) => {
  try {
    const missing = validate(["receiverId", "senderItemId", "receiverItemId"], req.body);
    if (missing) return res.status(400).json({ message: `Missing field: ${missing}` });
    const swap = await SwapRequest.create({
      ...req.body,
      senderId: req.auth.id,
    });
    await ClothingItem.findByIdAndUpdate(req.body.receiverItemId, {
      status: "requested",
    });
    res.status(201).json(swap);
  } catch (error) {
    next(error);
  }
});
app.get("/api/swaps", requireAuth, async (req, res, next) => {
  try {
    res.json(
      await SwapRequest.find({
        $or: [{ senderId: req.auth.id }, { receiverId: req.auth.id }],
      })
        .sort({ createdAt: -1 })
        .populate("senderItemId receiverItemId senderId receiverId"),
    );
  } catch (error) {
    next(error);
  }
});
app.put("/api/swaps/:id", requireAuth, async (req, res, next) => {
  try {
    const allowed = ["negotiating", "accepted", "completed", "declined", "cancelled"];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid swap status." });
    const swap = await SwapRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ senderId: req.auth.id }, { receiverId: req.auth.id }],
      },
      { status: req.body.status },
      { new: true },
    );
    if (!swap) return res.status(404).json({ message: "Swap request not found." });
    res.json(swap);
  } catch (error) {
    next(error);
  }
});
app.post("/api/reports", requireAuth, async (req, res, next) => {
  try {
    const missing = validate(["reason"], req.body);
    if (missing)
      return res.status(400).json({ message: "Choose a reason for your report." });
    res.status(201).json(await Report.create({ ...req.body, reporterId: req.auth.id }));
  } catch (error) {
    next(error);
  }
});
app.get("/api/admin/reports", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    res.json(
      await Report.find()
        .sort({ createdAt: -1 })
        .populate("reporterId reportedUserId reportedItemId"),
    );
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res
    .status(error.name === "ValidationError" ? 400 : 500)
    .json({ message: "Something went wrong." });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is required. Copy .env.example to .env before starting the API.",
    );
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () =>
    console.log(`Homies Wear API listening on http://localhost:${port}`),
  );
}
start().catch((error) => {
  console.error("Database connection failed:", error.message);
  process.exit(1);
});
