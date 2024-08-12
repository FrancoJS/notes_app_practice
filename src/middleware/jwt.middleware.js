import jwt from "jsonwebtoken";

export const createToken = (email, u_id) => {
	return jwt.sign({ email, u_id }, process.env.JWT_SECRET, { expiresIn: "2h" });
};
