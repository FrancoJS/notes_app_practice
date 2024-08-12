import { db } from "../database/connection.database.js";

const createNote = async (title, description, u_id) => {
	const query = {
		text: `
            INSERT INTO NOTES (TITLE, DESCRIPTION, U_ID)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
		values: [title, description, u_id],
	};
	const { rows } = await db.query(query);
	return rows[0];
};

const getAllNotes = async (u_id) => {
	const query = {
		text: `
			SELECT * FROM NOTES 
			WHERE U_ID = $1
			ORDER BY N_ID ASC
		`,
		values: [u_id],
	};
	const { rows } = await db.query(query);
	return rows;
};

const updateNote = async (title, description, n_id, u_id) => {
	const query = {
		text: `
			UPDATE NOTES 
			SET TITLE = $1,
			DESCRIPTION = $2
			WHERE N_ID = $3 AND
			U_ID = $4
			RETURNING *
		`,
		values: [title, description, n_id, u_id],
	};
	const { rows } = await db.query(query);
	return rows[0];
};

const deleteNote = async (n_id, u_id) => {
	const query = {
		text: `
			DELETE FROM NOTES
			WHERE N_ID = $1 AND
			U_ID = $2
			RETURNING *
		`,
		values: [n_id, u_id],
	};
	const { rows } = await db.query(query);
	return rows[0];
};

export const NotesModel = {
	createNote,
	getAllNotes,
	updateNote,
	deleteNote,
};
