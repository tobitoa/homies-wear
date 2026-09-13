import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import { logger } from "../utils/logger.js";
import {
  User,
  ClothingItem,
  SwapRequest,
  Conversation,
  Message,
  Notification,
  Favorite,
  Rating,
  Report,
} from "../models/index.js";

const images = {
  hoodie:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85",
  jacket:
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
  sweater:
    "https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=800&q=85",
  track:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
  shirt:
    "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85",
  tee: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=85",
  pants:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85",
  varsity:
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=85",
};

export async function seedData(clearExisting = true) {
  logger.info("Seeding realistic database records...");

  if (clearExisting) {
    await Promise.all([
      User.deleteMany({}),
      ClothingItem.deleteMany({}),
      SwapRequest.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Favorite.deleteMany({}),
      Rating.deleteMany({}),
      Report.deleteMany({}),
    ]);
    logger.info("Cleared existing records.");
  }

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Users
  const users = await User.create([
    {
      name: "Pankaj Borah",
      email: "pankaj@homieswear.com",
      passwordHash: defaultPasswordHash,
      avatar: "PB",
      location: "Jorhat, Assam",
      locationGeo: { type: "Point", coordinates: [94.2037, 26.7509] },
      bio: "Passionate about sustainable slow fashion and boxy linen fits. Based in Jorhat.",
      role: "user",
      rating: 4.9,
      ratingCount: 14,
      responseRate: 98,
      successfulSwaps: 12,
    },
    {
      name: "Rahul Sharma",
      email: "rahul@homieswear.com",
      passwordHash: defaultPasswordHash,
      avatar: "RS",
      location: "Jorhat Central",
      locationGeo: { type: "Point", coordinates: [94.207, 26.753] },
      bio: "Streetwear collector. Heavy hoodies, oversized drops and vintage tees.",
      role: "user",
      rating: 4.8,
      ratingCount: 9,
      responseRate: 92,
      successfulSwaps: 8,
    },
    {
      name: "Ananya Baruah",
      email: "ananya@homieswear.com",
      passwordHash: defaultPasswordHash,
      avatar: "AB",
      location: "Titabor, Assam",
      locationGeo: { type: "Point", coordinates: [94.18, 26.58] },
      bio: "Textile designer loving classic denim, jackets, and timeless outerwear.",
      role: "user",
      rating: 5.0,
      ratingCount: 11,
      responseRate: 96,
      successfulSwaps: 10,
    },
    {
      name: "Sneha Dutta",
      email: "sneha@homieswear.com",
      passwordHash: defaultPasswordHash,
      avatar: "SD",
      location: "Cinnamara, Assam",
      locationGeo: { type: "Point", coordinates: [94.23, 26.71] },
      bio: "Knitwear, cozy earth-toned layers and minimal aesthetics.",
      role: "user",
      rating: 4.7,
      ratingCount: 7,
      responseRate: 90,
      successfulSwaps: 6,
    },
    {
      name: "Karthik Gogoi",
      email: "karthik@homieswear.com",
      passwordHash: defaultPasswordHash,
      avatar: "KG",
      location: "Mariani, Assam",
      locationGeo: { type: "Point", coordinates: [94.32, 26.66] },
      bio: "Vintage athletic wear, nylon windbreakers and retro track jackets.",
      role: "user",
      rating: 4.9,
      ratingCount: 8,
      responseRate: 94,
      successfulSwaps: 7,
    },
    {
      name: "Admin Homies",
      email: "admin@homieswear.com",
      passwordHash: defaultPasswordHash,
      avatar: "AH",
      location: "Jorhat, Assam",
      locationGeo: { type: "Point", coordinates: [94.2037, 26.7509] },
      bio: "Homies Wear Community Administrator",
      role: "admin",
      rating: 5.0,
      ratingCount: 20,
      responseRate: 100,
      successfulSwaps: 25,
    },
  ]);

  const [pankaj, rahul, ananya, sneha, karthik] = users;
  logger.info(`Created ${users.length} realistic community members.`);

  // 2. Create Realistic Clothing Items
  const items = await ClothingItem.create([
    {
      ownerId: rahul._id,
      title: "Oversized Fleece Hoodie",
      description:
        "Heavyweight 450gsm brushed cotton hoodie with relaxed dropped shoulders. Worn twice, gently hand-washed.",
      category: "Streetwear",
      brand: "Nike",
      size: "M",
      condition: "Excellent",
      color: "Charcoal",
      images: [images.hoodie],
      estimatedValue: 2800,
      location: "Jorhat Central",
      locationGeo: { type: "Point", coordinates: [94.207, 26.753] },
      status: "AVAILABLE",
    },
    {
      ownerId: ananya._id,
      title: "Denim Trucker Jacket",
      description:
        "Authentic washed indigo denim jacket with brass hardware and dual chest pockets. Pristine condition with zero fraying.",
      category: "Outerwear",
      brand: "Levi's",
      size: "L",
      condition: "Good",
      color: "Blue",
      images: [images.jacket],
      estimatedValue: 3200,
      location: "Titabor, Assam",
      locationGeo: { type: "Point", coordinates: [94.18, 26.58] },
      status: "AVAILABLE",
    },
    {
      ownerId: sneha._id,
      title: "Soft Knit Ribbed Sweater",
      description:
        "Cloud-soft wool blend in a natural cream hue with ribbed hem and cuffs. Perfect layering piece for cool mornings.",
      category: "Women",
      brand: "Zara",
      size: "S",
      condition: "Like new",
      color: "Cream",
      images: [images.sweater],
      estimatedValue: 1900,
      location: "Cinnamara, Assam",
      locationGeo: { type: "Point", coordinates: [94.23, 26.71] },
      status: "AVAILABLE",
    },
    {
      ownerId: karthik._id,
      title: "Archive Track Jacket",
      description:
        "Retro 90s style track top with contrasting side stripes and embroidered trefoil logo. Breathable polyester weave.",
      category: "Sportswear",
      brand: "Adidas",
      size: "M",
      condition: "Excellent",
      color: "Olive",
      images: [images.track],
      estimatedValue: 2400,
      location: "Mariani, Assam",
      locationGeo: { type: "Point", coordinates: [94.32, 26.66] },
      status: "AVAILABLE",
    },
    {
      ownerId: pankaj._id,
      title: "Linen Camp Collar Shirt",
      description:
        "100% French linen summer shirt with relaxed camp collar and side split hem. Super airy and beautifully textured.",
      category: "Unisex",
      brand: "Uniqlo",
      size: "M",
      condition: "Good",
      color: "White",
      images: [images.shirt],
      estimatedValue: 2400,
      location: "Jorhat, Assam",
      locationGeo: { type: "Point", coordinates: [94.2037, 26.7509] },
      status: "AVAILABLE",
    },
    {
      ownerId: rahul._id,
      title: "Graphic Oversized Tee",
      description:
        "Limited edition heavyweight boxy graphic tee with screen printed typography. Stored folded in smoke-free closet.",
      category: "Streetwear",
      brand: "Stussy",
      size: "L",
      condition: "Excellent",
      color: "White",
      images: [images.tee],
      estimatedValue: 2100,
      location: "Jorhat Central",
      locationGeo: { type: "Point", coordinates: [94.207, 26.753] },
      status: "AVAILABLE",
    },
    {
      ownerId: sneha._id,
      title: "Relaxed Workwear Cargo Pants",
      description:
        "Durable ripstop cotton cargo pants with reinforced knees and functional utility pockets. Relaxed straight leg cut.",
      category: "Unisex",
      brand: "Carhartt",
      size: "32",
      condition: "Good",
      color: "Olive",
      images: [images.pants],
      estimatedValue: 2700,
      location: "Cinnamara, Assam",
      locationGeo: { type: "Point", coordinates: [94.23, 26.71] },
      status: "AVAILABLE",
    },
    {
      ownerId: karthik._id,
      title: "Vintage Varsity Bomber Jacket",
      description:
        "Wool body with faux leather sleeves, snap button front, and retro chenille badge on chest. Incredible vintage look.",
      category: "Vintage",
      brand: "Champion",
      size: "M",
      condition: "Good",
      color: "Navy",
      images: [images.varsity],
      estimatedValue: 3600,
      location: "Mariani, Assam",
      locationGeo: { type: "Point", coordinates: [94.32, 26.66] },
      status: "AVAILABLE",
    },
  ]);
  logger.info(`Created ${items.length} realistic clothing listings.`);

  const [
    hoodie,
    denimJacket,
    sweater,
    trackJacket,
    linenShirt,
    tee,
    cargoPants,
    varsity,
  ] = items;

  // 3. Create Realistic Swap Requests & Conversations
  const swap1 = await SwapRequest.create({
    senderId: pankaj._id,
    receiverId: rahul._id,
    senderItemId: linenShirt._id,
    receiverItemId: hoodie._id,
    senderValue: linenShirt.estimatedValue,
    receiverValue: hoodie.estimatedValue,
    message:
      "Hey Rahul! Loved the charcoal hoodie. Would you be open to swapping it for my linen camp shirt?",
    status: "PENDING",
    history: [
      {
        proposedBy: pankaj._id,
        senderItemId: linenShirt._id,
        receiverItemId: hoodie._id,
        senderValue: linenShirt.estimatedValue,
        receiverValue: hoodie.estimatedValue,
        message: "Initial offer",
        createdAt: new Date(Date.now() - 3600000 * 4),
      },
    ],
  });

  const conv1 = await Conversation.create({
    participants: [pankaj._id, rahul._id],
    swapRequestId: swap1._id,
  });

  const msg1 = await Message.create({
    conversationId: conv1._id,
    senderId: pankaj._id,
    receiverId: rahul._id,
    text: "Hey! I'm interested in your hoodie. Looks super clean.",
    type: "text",
    createdAt: new Date(Date.now() - 3600000 * 5),
  });
  const msg2 = await Message.create({
    conversationId: conv1._id,
    senderId: rahul._id,
    receiverId: pankaj._id,
    text: "Thanks man! It's super cozy. What piece do you have in mind for an exchange?",
    type: "text",
    createdAt: new Date(Date.now() - 3600000 * 4.5),
  });
  const msg3 = await Message.create({
    conversationId: conv1._id,
    senderId: pankaj._id,
    receiverId: rahul._id,
    text: "Swap proposal sent: Uniqlo Linen Shirt ⇄ Nike Fleece Hoodie",
    type: "swap_proposal",
    swapRequestId: swap1._id,
    swapData: {
      senderItemId: linenShirt._id,
      receiverItemId: hoodie._id,
      senderValue: linenShirt.estimatedValue,
      receiverValue: hoodie.estimatedValue,
      status: "PENDING",
    },
    createdAt: new Date(Date.now() - 3600000 * 4),
  });

  conv1.lastMessage = msg3._id;
  await conv1.save();

  const swap2 = await SwapRequest.create({
    senderId: ananya._id,
    receiverId: pankaj._id,
    senderItemId: denimJacket._id,
    receiverItemId: linenShirt._id,
    senderValue: 3200,
    receiverValue: 2600,
    message: "Hey Pankaj, happy to swap if we can do a quick fitting in Jorhat!",
    status: "COUNTERED",
    history: [
      {
        proposedBy: ananya._id,
        senderItemId: denimJacket._id,
        receiverItemId: linenShirt._id,
        senderValue: 3200,
        receiverValue: 2400,
        message: "Original proposal",
        createdAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        proposedBy: pankaj._id,
        senderItemId: denimJacket._id,
        receiverItemId: linenShirt._id,
        senderValue: 3200,
        receiverValue: 2600,
        message: "Counter offer with adjusted estimated value",
        createdAt: new Date(Date.now() - 3600000 * 12),
      },
    ],
  });

  await Notification.create([
    {
      userId: rahul._id,
      type: "SWAP_REQUEST",
      title: "New Swap Request",
      body: "Pankaj Borah sent you a swap proposal for your Oversized Fleece Hoodie.",
      data: { swapId: swap1._id, senderId: pankaj._id },
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      userId: pankaj._id,
      type: "SWAP_COUNTER",
      title: "Counter Offer Received",
      body: "Ananya Baruah sent a counter offer on the Denim Trucker Jacket.",
      data: { swapId: swap2._id, senderId: ananya._id },
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
  ]);

  await Favorite.create([
    { userId: pankaj._id, itemId: hoodie._id },
    { userId: pankaj._id, itemId: varsity._id },
  ]);

  logger.info("Database seeding completed successfully! ✨");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  connectDB()
    .then(() => seedData(true))
    .then(() => disconnectDB())
    .catch((err) => {
      logger.error("Seeding failed:", err);
      process.exit(1);
    });
}
