import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Do not expose passwordHash by default
    },
    avatar: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Jorhat, Assam",
      trim: true,
    },
    locationGeo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [94.2037, 26.7509], // Jorhat center
      },
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    responseRate: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
    },
    successfulSwaps: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.index({ locationGeo: "2dsphere" });

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    location: this.location,
    coordinates: this.locationGeo?.coordinates || [94.2037, 26.7509],
    bio: this.bio,
    role: this.role,
    rating: Number(this.rating.toFixed(1)),
    ratingCount: this.ratingCount,
    responseRate: this.responseRate,
    successfulSwaps: this.successfulSwaps,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model("User", userSchema);
