import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.render("index");
});

router.get("/login-register", (req, res) => {
	res.render("forms");
});

router.get("/notes", (req, res) => {
	res.render("notes");
});

export default router;
