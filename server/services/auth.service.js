import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
}

export async function registerUser({
  name,
  email,
  password,
  location,
  coordinates,
  bio,
}) {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw ApiError.conflict("An account with this email address already exists.");
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const coords =
    Array.isArray(coordinates) && coordinates.length === 2
      ? coordinates
      : [94.2037, 26.7509]; // Jorhat default

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    location: location?.trim() || "Jorhat, Assam",
    locationGeo: {
      type: "Point",
      coordinates: coords,
    },
    bio: bio?.trim() || "",
  });

  const token = signToken(user);
  return {
    token,
    user: user.toSafeObject(),
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user) {
    throw ApiError.unauthorized("Incorrect email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Incorrect email or password.");
  }

  const token = signToken(user);
  return {
    token,
    user: user.toSafeObject(),
  };
}

export async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  return user.toSafeObject();
}
