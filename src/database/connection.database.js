import pg from "pg";

//CREAR UNA NUEVA POOL DE CONEXIONES PARA MANTENERSE CONECTADO A LA BASE DE DATOS Y PODER REALIZAR CONSULTAS SIN NECESIDAD DE CONECTAR SIEMPRE
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
export const db = new Pool({
	connectionString,
	allowExitOnIdle: true,
});

//CONEXION
try {
	await db.query("SELECT NOW()");
	console.log("DATABASE CONNECTED");
} catch (error) {
	console.log(error);
}
