import jwt from "jsonwebtoken";

export const createToken = (email, u_id) => {
	return jwt.sign({ email, u_id }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

export const verifyToken = (req, res, next) => {
	let token = req.headers.authorization;
	if (!token) return res.status(401).json({ ok: false, msg: "No estas autorizado para ver esta pagina" });

	token = token.split(" ")[1];
	try {
		const { u_id, email } = jwt.verify(token, process.env.JWT_SECRET);
		req.u_id = u_id;
		req.email = email;
		next();
	} catch (error) {
		res.status(400).json({ ok: false, msg: "No estas autorizado para ver esta pagina, Token invalido" });
	}
};
