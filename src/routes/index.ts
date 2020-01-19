import { Router } from "express";
import UserRouter from "./Users";
import AuthRouter from "./Auth";
import GroupRouter from "./Group";
import CategoryRouter from "./Category";
// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", UserRouter);
router.use("/auth", AuthRouter);
router.use("/groups", GroupRouter);
router.use("/categories", CategoryRouter);

// Export the base-router
export default router;
