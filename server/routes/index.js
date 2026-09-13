import { Router } from "express";
import authRoutes from "./auth.routes.js";
import itemRoutes from "./item.routes.js";
import swapRoutes from "./swap.routes.js";
import conversationRoutes from "./conversation.routes.js";
import notificationRoutes from "./notification.routes.js";
import favoriteRoutes from "./favorite.routes.js";
import ratingRoutes from "./rating.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import userRoutes from "./user.routes.js";
import reportRoutes from "./report.routes.js";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "homies-wear-api",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/items", itemRoutes);
apiRouter.use("/swaps", swapRoutes);
apiRouter.use("/conversations", conversationRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/favorites", favoriteRoutes);
apiRouter.use("/ratings", ratingRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/reports", reportRoutes);

export default apiRouter;
