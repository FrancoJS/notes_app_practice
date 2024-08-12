import { db } from "../database/connection.database.js";

const createUser = async (name, last_name, email, password) => {
	const query = {
		text: `
            INSERT INTO USERS (NAME, LAST_NAME, EMAIL, PASSWORD)
            VALUES ($1, $2, $3, $4)
            RETURNING NAME, LAST_NAME, EMAIL, U_ID
        `,
		values: [name, last_name, email, password],
	};
	const { rows } = await db.query(query);
	return rows[0];
};

const findOneByEmail = async (email) => {
	const query = {
		text: `
			SELECT * FROM USERS WHERE EMAIL = $1
		`,
		values: [email],
	};

	const { rows } = await db.query(query);
	return rows[0];
};

export const UserModel = {
	createUser,
	findOneByEmail,
};
