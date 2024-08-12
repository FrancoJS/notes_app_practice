import bcrypt from "bcrypt";

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

export const passwordService = {
	hashPassword,
	comparePassword,
};
