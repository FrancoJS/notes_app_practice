import { NotesModel } from "../models/notes.model.js";

const createNote = async (req, res) => {
	try {
		const { title, description } = req?.body;
		if (!title || !description) {
			return res.status(400).json({ ok: false, msg: "Campos requeridos vacios: titulo o descripcion" });
		}
		console.log(req.u_id);
		const newNote = await NotesModel.createNote(title, description, req.u_id);
		res.status(200).json({ ok: true, msg: newNote });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false });
	}
};

export const NotesController = {
	createNote,
};
