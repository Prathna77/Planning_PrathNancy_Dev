import { Router } from "express";
import noteRoutes from "./routes/note.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import backgroundRoutes from "./routes/background.routes.js";

const router = Router();

router.use("/notes", noteRoutes);
router.use("/settings", settingsRoutes);
router.use("/backgrounds", backgroundRoutes);

export default router;
