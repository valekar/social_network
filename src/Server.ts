import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import BaseRouter from "./routes";

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api", BaseRouter);

const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Export express instance
export default app;
