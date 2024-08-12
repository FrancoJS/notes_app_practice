import { Router } from "express";
import { verifyToken } from "../middleware/jwt.middleware.js";
import { NotesController } from "../controllers/notes.controller.js";

const router = Router();

router.post("/create", verifyToken, NotesController.createNote);
router.put("/update/:n_id", verifyToken, NotesController.updateNote);
router.delete("/delete/:n_id", verifyToken, NotesController.deleteNote);
router.get("/", verifyToken, NotesController.getAllNotes);

export default router;
