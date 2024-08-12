import { NotesModel } from "../models/notes.model.js";

const createNote = async (req, res) => {
	try {
		const { title, description } = req?.body;
		if (!title || !description) {
			return res.status(400).json({ ok: false, msg: "Campos requeridos vacios: titulo o descripcion" });
		}
		const newNote = await NotesModel.createNote(title, description, req.u_id);
		res.status(200).json({ ok: true, msg: newNote });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false });
	}
};

const getAllNotes = async (req, res) => {
	try {
		const notes = await NotesModel.getAllNotes(req.u_id);
		if (notes.length < 1) return res.status(404).json({ ok: false, msg: "No existen notas para mostrar" });
		res.status(200).json({ ok: true, msg: notes });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false });
	}
};

const updateNote = async (req, res) => {
	try {
		const { title, description } = req?.body;
		const { n_id } = req?.params;
		if (!title || !description) return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
		const updatedNote = await NotesModel.updateNote(title, description, n_id, req.u_id);
		res.status(200).json({ ok: true, msg: updatedNote });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false });
	}
};

const deleteNote = async (req, res) => {
	try {
		const { n_id } = req?.params;
		if (!n_id) return res.status(400).json({ ok: false, msg: "Es necesario el n_id" });
		const deletedNote = await NotesModel.deleteNote(n_id, req.u_id);
		res.status(200).json({ ok: true, msg: deletedNote });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false });
	}
};

export const NotesController = {
	createNote,
	getAllNotes,
	updateNote,
	deleteNote,
};
