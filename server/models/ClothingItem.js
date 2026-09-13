import mongoose from "mongoose";

export const ITEM_STATUSES = [
  "AVAILABLE",
  "NEGOTIATING",
  "RESERVED",
  "SWAPPED",
  "ARCHIVED",
  "REMOVED",
];

const clothingItemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      maxlength: 1200,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "Unbranded",
      index: true,
    },
    size: {
      type: String,
      trim: true,
      default: "M",
    },
    condition: {
      type: String,
      enum: ["Brand new", "Like new", "Excellent", "Good", "Fair"],
      default: "Good",
      index: true,
    },
    color: {
      type: String,
      trim: true,
      default: "Multi",
    },
    images: [
      {
        type: String,
      },
    ],
    estimatedValue: {
      type: Number,
      required: [true, "Estimated value is required"],
      min: [0, "Estimated value cannot be negative"],
    },
    location: {
      type: String,
      default: "Jorhat, Assam",
      trim: true,
      index: true,
    },
    locationGeo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [94.2037, 26.7509],
      },
    },
    status: {
      type: String,
      enum: ITEM_STATUSES,
      default: "AVAILABLE",
      index: true,
    },
  },
  { timestamps: true },
);

// Search and compound indexes
clothingItemSchema.index({
  title: "text",
  brand: "text",
  category: "text",
  description: "text",
});
clothingItemSchema.index({ ownerId: 1, status: 1 });
clothingItemSchema.index({ category: 1, status: 1 });
clothingItemSchema.index({ brand: 1, status: 1 });
clothingItemSchema.index({ condition: 1, status: 1 });
clothingItemSchema.index({ status: 1, createdAt: -1 });
clothingItemSchema.index({ locationGeo: "2dsphere" });

export const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);
