import { ClothingItem, Favorite } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { calculateDistanceKm, formatDistance } from "../utils/distance.js";

const DEFAULT_CENTER = { lat: 26.7509, lng: 94.2037 }; // Jorhat, Assam

export async function getItems({
  q,
  category,
  brand,
  condition,
  size,
  minPrice,
  maxPrice,
  sort = "Recommended",
  page = 1,
  limit = 20,
  ownerId,
  status = "AVAILABLE",
  userLat = DEFAULT_CENTER.lat,
  userLng = DEFAULT_CENTER.lng,
  currentUserId,
}) {
  const query = {};

  if (status && status !== "ALL") {
    query.status = status;
  }

  if (ownerId) {
    query.ownerId = ownerId;
  }

  if (category && category !== "All pieces" && category !== "ALL") {
    query.category = category;
  }

  if (brand) {
    query.brand = new RegExp(brand.trim(), "i");
  }

  if (condition) {
    query.condition = condition;
  }

  if (size) {
    query.size = size;
  }

  if (minPrice != null || maxPrice != null) {
    query.estimatedValue = {};
    if (minPrice != null) query.estimatedValue.$gte = Number(minPrice);
    if (maxPrice != null) query.estimatedValue.$lte = Number(maxPrice);
  }

  if (q && q.trim()) {
    query.$or = [
      { title: { $regex: q.trim(), $options: "i" } },
      { brand: { $regex: q.trim(), $options: "i" } },
      { category: { $regex: q.trim(), $options: "i" } },
      { description: { $regex: q.trim(), $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  let sortObj = { createdAt: -1 };
  if (sort === "Highest value") sortObj = { estimatedValue: -1 };
  else if (sort === "Lowest value") sortObj = { estimatedValue: 1 };
  else if (sort === "Recently added") sortObj = { createdAt: -1 };

  const [items, total] = await Promise.all([
    ClothingItem.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate("ownerId", "name avatar location rating responseRate successfulSwaps")
      .lean(),
    ClothingItem.countDocuments(query),
  ]);

  // Fetch current user favorites if logged in
  let userFavorites = new Set();
  if (currentUserId) {
    const favs = await Favorite.find({ userId: currentUserId }).select("itemId").lean();
    userFavorites = new Set(favs.map((f) => f.itemId.toString()));
  }

  const targetLat = Number(userLat) || DEFAULT_CENTER.lat;
  const targetLng = Number(userLng) || DEFAULT_CENTER.lng;

  const transformedItems = items.map((item) => {
    const coords = item.locationGeo?.coordinates;
    let distanceKm = null;
    if (coords && coords.length === 2) {
      distanceKm = calculateDistanceKm(targetLat, targetLng, coords[1], coords[0]);
    }

    return {
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      brand: item.brand,
      size: item.size,
      condition: item.condition,
      color: item.color,
      images:
        item.images && item.images.length > 0
          ? item.images
          : ["/logomark-transparent.png"],
      image: item.images?.[0] || "/logomark-transparent.png",
      value: item.estimatedValue,
      estimatedValue: item.estimatedValue,
      location: item.location || "Jorhat, Assam",
      distance: formatDistance(distanceKm),
      distanceKm,
      status: item.status,
      owner: item.ownerId?.name || "Homie",
      ownerId: item.ownerId?._id?.toString() || item.ownerId,
      ownerDetails: item.ownerId,
      isFavorite: userFavorites.has(item._id.toString()),
      createdAt: item.createdAt,
    };
  });

  if (sort === "Nearest first") {
    transformedItems.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  }

  return {
    items: transformedItems,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    },
  };
}

export async function getNearbyItems({
  lat = DEFAULT_CENTER.lat,
  lng = DEFAULT_CENTER.lng,
  radiusKm = 25,
  limit = 20,
  currentUserId,
}) {
  const targetLat = Number(lat) || DEFAULT_CENTER.lat;
  const targetLng = Number(lng) || DEFAULT_CENTER.lng;
  const maxMeters = (Number(radiusKm) || 25) * 1000;

  // Attempt geospatial query
  let items = [];
  try {
    items = await ClothingItem.find({
      status: "AVAILABLE",
      locationGeo: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [targetLng, targetLat],
          },
          $maxDistance: maxMeters,
        },
      },
    })
      .limit(Number(limit) || 20)
      .populate("ownerId", "name avatar location rating responseRate successfulSwaps")
      .lean();
  } catch {
    // Fallback if 2dsphere index building or exact geo query encounters fallback
    items = await ClothingItem.find({ status: "AVAILABLE" })
      .limit(50)
      .populate("ownerId", "name avatar location rating responseRate successfulSwaps")
      .lean();
  }

  let userFavorites = new Set();
  if (currentUserId) {
    const favs = await Favorite.find({ userId: currentUserId }).select("itemId").lean();
    userFavorites = new Set(favs.map((f) => f.itemId.toString()));
  }

  const mapped = items
    .map((item) => {
      const coords = item.locationGeo?.coordinates;
      let distanceKm = null;
      if (coords && coords.length === 2) {
        distanceKm = calculateDistanceKm(targetLat, targetLng, coords[1], coords[0]);
      }
      return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        category: item.category,
        brand: item.brand,
        size: item.size,
        condition: item.condition,
        color: item.color,
        images: item.images || [],
        image: item.images?.[0] || "/logomark-transparent.png",
        value: item.estimatedValue,
        estimatedValue: item.estimatedValue,
        location: item.location || "Jorhat, Assam",
        distance: formatDistance(distanceKm),
        distanceKm,
        status: item.status,
        owner: item.ownerId?.name || "Homie",
        ownerId: item.ownerId?._id?.toString() || item.ownerId,
        ownerDetails: item.ownerId,
        isFavorite: userFavorites.has(item._id.toString()),
        createdAt: item.createdAt,
      };
    })
    .filter((item) => item.distanceKm == null || item.distanceKm <= radiusKm)
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    .slice(0, Number(limit) || 20);

  return mapped;
}

export async function getItemById(id, currentUserId) {
  const item = await ClothingItem.findById(id)
    .populate(
      "ownerId",
      "name avatar location rating ratingCount responseRate successfulSwaps bio createdAt",
    )
    .lean();

  if (!item || item.status === "REMOVED") {
    throw ApiError.notFound("Clothing item not found.");
  }

  let isFavorite = false;
  if (currentUserId) {
    isFavorite = !!(await Favorite.exists({ userId: currentUserId, itemId: item._id }));
  }

  const coords = item.locationGeo?.coordinates;
  const distanceKm =
    coords && coords.length === 2
      ? calculateDistanceKm(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, coords[1], coords[0])
      : null;

  return {
    id: item._id.toString(),
    title: item.title,
    description: item.description,
    category: item.category,
    brand: item.brand,
    size: item.size,
    condition: item.condition,
    color: item.color,
    images:
      item.images && item.images.length > 0 ? item.images : ["/logomark-transparent.png"],
    image: item.images?.[0] || "/logomark-transparent.png",
    value: item.estimatedValue,
    estimatedValue: item.estimatedValue,
    location: item.location || "Jorhat, Assam",
    distance: formatDistance(distanceKm),
    distanceKm,
    status: item.status,
    owner: item.ownerId?.name || "Homie",
    ownerId: item.ownerId?._id?.toString() || item.ownerId,
    ownerDetails: item.ownerId,
    isFavorite,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function createItem(ownerId, data) {
  const coords =
    Array.isArray(data.coordinates) && data.coordinates.length === 2
      ? data.coordinates
      : [94.2037, 26.7509];

  const item = await ClothingItem.create({
    ownerId,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    category: data.category.trim(),
    brand: data.brand?.trim() || "Unbranded",
    size: data.size?.trim() || "M",
    condition: data.condition || "Good",
    color: data.color?.trim() || "Multi",
    images:
      Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : [data.image || "/logomark-transparent.png"],
    estimatedValue: Number(data.estimatedValue),
    location: data.location?.trim() || "Jorhat, Assam",
    locationGeo: {
      type: "Point",
      coordinates: coords,
    },
    status: "AVAILABLE",
  });

  return getItemById(item._id, ownerId);
}

export async function updateItem(id, ownerId, data) {
  const item = await ClothingItem.findById(id);
  if (!item) {
    throw ApiError.notFound("Item not found.");
  }
  if (item.ownerId.toString() !== ownerId.toString()) {
    throw ApiError.forbidden("You can only edit your own listings.");
  }

  const allowedFields = [
    "title",
    "description",
    "category",
    "brand",
    "size",
    "condition",
    "color",
    "images",
    "estimatedValue",
    "location",
    "status",
  ];
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      item[field] = data[field];
    }
  }

  if (data.coordinates && Array.isArray(data.coordinates)) {
    item.locationGeo = { type: "Point", coordinates: data.coordinates };
  }

  await item.save();
  return getItemById(item._id, ownerId);
}

export async function deleteItem(id, ownerId) {
  const item = await ClothingItem.findById(id);
  if (!item) {
    throw ApiError.notFound("Item not found.");
  }
  if (item.ownerId.toString() !== ownerId.toString()) {
    throw ApiError.forbidden("You can only delete your own listings.");
  }

  item.status = "REMOVED";
  await item.save();
  return { message: "Listing removed successfully." };
}
