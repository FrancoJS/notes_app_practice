import jwt from "jsonwebtoken";

//NO ES UN MIDDLEWARE PERO SI UN SERVICIO DE GENERAR UN TOKEN
export const createToken = (email, u_id, name) => {
	return jwt.sign({ email, u_id, name }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

//MIDDLEWARE PARA VERIFICAR SI TOKEN ES VALIDO
export const verifyToken = (req, res, next) => {
	let token = req.headers.authorization;
	if (!token) return res.status(401).json({ ok: false, msg: "No estas autorizado para ver esta pagina" });

	token = token.split(" ")[1];
	try {
		const { u_id, email, name } = jwt.verify(token, process.env.JWT_SECRET);
		req.u_id = u_id;
		req.email = email;
		req.name = name;
		next();
	} catch (error) {
		res.status(400).json({ ok: false, msg: "No estas autorizado para ver esta pagina, Token invalido" });
	}
};
