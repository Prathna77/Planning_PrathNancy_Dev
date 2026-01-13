import { Router } from "express";
import { BackgroundController } from "../controllers/background.controller.js";
import { uploadBackgroundImage } from "../middlewares/fileUpload.js";

const router = Router();

router.get("/", BackgroundController.list);

router.post(
    "/",
    uploadBackgroundImage.fields([{ name: "image", maxCount: 1 }, { name: "file", maxCount: 1 }]),
    (req, res, next) => {
        req.file = (req.files?.image?.[0] || req.files?.file?.[0]) ?? null;
        next();
    },
    BackgroundController.upload
);

router.delete("/:id", BackgroundController.remove);

export default router;
