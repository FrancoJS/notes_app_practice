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

export const NotesModel = {
	createNote,
};
