import { createToken } from "../middleware/jwt.middleware.js";
import { UserModel } from "../models/user.model.js";
import { passwordService } from "../services/password.service.js";

const createUser = async (req, res) => {
	try {
		const { name, last_name, email, password } = req?.body;
		if (!name || !last_name || !email || !password)
			return res.status(400).json({ ok: false, msg: "Missing required fields: name, last_name, email, password" });

		const user = await UserModel.findOneByEmail(email);
		if (user) return res.status(409).json({ ok: false, msg: "El usuario ya se encuentra registrado" });

		const hashedPassword = await passwordService.hashPassword(password);
		const newUser = await UserModel.createUser(name, last_name, email, hashedPassword);
		const token = createToken(newUser.email, newUser.u_id);
		res.status(200).json({ ok: true, token });
	} catch (error) {
		res.status(400).json({ ok: false });
		console.log(error);
	}
};

const findOneByEmail = async (req, res) => {
	try {
		const { email, password } = req?.body;
		if (!email || !password)
			return res.status(400).json({ ok: false, msg: "Missing required fields: email, password" });

		const user = await UserModel.findOneByEmail(email);
		if (!user) return res.status(409).json({ ok: false, msg: "El usuario no se encuentra registrado" });

		const isMatch = await passwordService.comparePassword(password, user.password);
		if (!isMatch) return res.status(400).json({ ok: false, msg: "Invalid credentials" });

		const token = createToken(user.email, user.u_id);
		res.status(200).json({ ok: true, msg: user, token });
	} catch (error) {
		res.status(400).json({ ok: false });
		console.log(error);
	}
};

export const UserController = {
	createUser,
	findOneByEmail,
};
