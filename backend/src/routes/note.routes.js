import { Router } from "express";
import { NoteController } from "../controllers/note.controller.js";

const router = Router();

router.get("/", NoteController.getByYear);
router.get("/:date", NoteController.getByDate);
router.put("/:date", NoteController.upsert);
router.delete("/:date", NoteController.delete);

export default router;
