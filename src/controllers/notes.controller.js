import { NotesModel } from "../models/notes.model.js";

//CONTROLADORES QUE MANDAN LOS DATOS AL MODELO PARA REALIZAR OPERACIONES CON LA BASE DE DATOS

//VA A MANDAR DATOS AL MODELO PARA CREAR NOTAS CON U_ID
const createNote = async (req, res) => {
	try {
		const { title, description } = req?.body;
		if (!title || !description) {
			return res.status(400).json({ ok: false, msg: "Campos requeridos vacios: titulo o descripcion" });
		}
		const newNote = await NotesModel.createNote(title, description, req.u_id);
		res.status(200).json({ ok: true, msg: newNote });
	} catch (error) {
		res.status(400).json({ ok: false });
	}
};

//OBTENER TODAS LAS NOTAS CON U_ID
const getAllNotes = async (req, res) => {
	try {
		let { limit = 9, page = 1 } = req.query;
		limit = +limit;
		page = +page;

		if (page < 1 || limit < 1 || limit > 100) return res.status(400).json({ ok: false, error: "Queries invalidas" });

		const notes = await NotesModel.getAllNotes(req.u_id, limit, page);
		if (notes.length < 1) return res.status(404).json({ ok: false, msg: "No existen notas para mostrar" });

		const count = await NotesModel.countNotes(req.u_id);
		const baseUrl = `${req.protocol}://${req.get("host")}/api/notes`;
		const baseUrlWithQueries = `${baseUrl}?limit${limit}`;
		const totalPages = Math.ceil(count / limit);
		const nextPage = page + 1 > totalPages ? null : `${baseUrlWithQueries}&page=${page + 1}`;
		const prevPage = page - 1 < 1 ? null : `${baseUrlWithQueries}&page=${page - 1}`;

		res.status(200).json({
			ok: true,
			msg: notes,
			username: req.name,
			pagination: {
				count,
				totalPages,
				nextPage,
				prevPage,
				limit,
				currentPage: page,
			},
		});
	} catch (error) {
		res.status(400).json({ ok: false });
	}
};

//ACTUALIZAR NOTAS CON U_ID
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

//ELIMINAR NOTAS CON U_ID
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

//CONTROLADOR QUE VA A SER LLAMADO EN LA RUTAS
export const NotesController = {
	createNote,
	getAllNotes,
	updateNote,
	deleteNote,
};
