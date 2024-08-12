import { Router } from "express";
import { verifyToken } from "../middleware/jwt.middleware.js";
import { NotesController } from "../controllers/notes.controller.js";

const router = Router();

router.post("/create", verifyToken, NotesController.createNote);

export default router;
