import express from "express";
import { errorHandler } from "./middleware/error.middleware";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import noticeRoutes from "./routes/notice.routes";
import uploadRoutes from "./routes/upload.routes";
import bannerRoutes from "./routes/banner.routes";
import { generalApiLimiter } from "./middleware/rateLimiter";
import { getCorsOrigins } from "./config/env";

const app = express();

import subscriberRoutes from "./routes/subscriber.routes";

const corsOrigins = getCorsOrigins();
app.use(cors({
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api", generalApiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribers", subscriberRoutes);

app.get("/", (_req, res) => {
    res.json({ name: "ICEM Notice Portal API", status: "ok", docs: "/api/health" });
});

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});
app.use(errorHandler);

export default app;
