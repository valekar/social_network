import { Router } from "express";
import UserRouter from "./Users";
import AuthRouter from "./Auth";
import GroupRouter from "./Group";
import CategoryRouter from "./Category";
import CommentRouter from "./Comment";
import PhotoRouter from "./Photo";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", UserRouter);
router.use("/auth", AuthRouter);
router.use("/groups", GroupRouter);
router.use("/categories", CategoryRouter);
router.use("/comments", CommentRouter);
router.use("/photos", PhotoRouter);

// Export the base-router
export default router;
