import express from "express";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import viewRouter from "./routes/views.route.js";
import path from "path";

const app = express();
const __dirname = import.meta.dirname;
const publicPath = path.join(__dirname, process.env.PUBLIC_PATH);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

//Engine ejs
app.set("view engine", "ejs");
app.set("views", "src/views");

//Rutas
app.use("/", viewRouter);
app.use("/api/notes/users", userRouter);

const PORT = process.env.PORT | 3000;

app.listen(PORT, () => {
	console.log(`Escuchando el puerto ${PORT}`);
});
