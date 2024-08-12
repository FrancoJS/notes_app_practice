const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const [errorNameR, errorLastNameR, errorEmailR, errorPasswordR] = document.querySelectorAll(".error-register");
const [errorEmailL, errorPasswordL] = document.querySelectorAll(".error-login");
const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

registerForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const name = e.target.name.value;
	const last_name = e.target.last_name.value;
	const email = e.target.email.value;
	const password = e.target.password.value;
	!name ? (errorNameR.textContent = 'El campo "Nombre" es obligatorio') : (errorNameR.textContent = "");
	!last_name ? (errorLastNameR.textContent = 'El campo "Apellido" es obligatorio') : (errorLastNameR.textContent = "");
	!email ? (errorEmailR.textContent = 'El campo "Email" es obligatorio') : (errorEmailR.textContent = "");
	!password ? (errorPasswordR.textContent = 'El campo "Contraseña" es obligatorio') : (errorPasswordR.textContent = "");
	password.length < 8
		? (errorPasswordR.textContent = 'El campo "Contraseña debe tener al menos 8 caracteres"')
		: (errorPasswordR.textContent = "");
	!emailRegex.test(email)
		? (errorEmailR.textContent = "Debe ingresar un email valido")
		: (errorEmailR.textContent = "");
	if (name && last_name && email && password && password.length >= 8 && emailRegex.test(email)) {
		try {
			const { data } = await axios.post("/api/notes/users/register", { name, last_name, email, password });
			const token = data.token;
			localStorage.setItem("token", token);
			// window.location.href = "/";
		} catch ({ response }) {
			const { data } = response;
			if (!data.ok) {
				const span = document.createElement("span");
				span.classList.add("error-register");
				span.textContent = data.msg;
				registerForm.appendChild(span);
			}
			console.log(data);
		}
	}
});

loginForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = e.target.email.value;
	const password = e.target.password.value;
	!email ? (errorEmailL.textContent = 'El campo "Email" es obligatorio') : (errorEmailL.textContent = "");
	!password ? (errorPasswordL.textContent = 'El campo "Contraseña" es obligatorio') : (errorPasswordL.textContent = "");
	password.length < 8
		? (errorPasswordL.textContent = 'El campo "Contraseña debe tener al menos 8 caracteres"')
		: (errorPasswordL.textContent = "");
	!emailRegex.test(email)
		? (errorEmailL.textContent = "Debe ingresar un email valido")
		: (errorEmailL.textContent = "");
	if (email && password && password.length >= 8 && emailRegex.test(email)) {
		try {
			const { data } = await axios.post("/api/notes/users/login", {
				email,
				password,
			});
			const token = data.token;
			localStorage.setItem("token", token);
		} catch ({ response }) {
			const { data } = response;
			if (!data.ok) {
				const span = document.createElement("span");
				span.classList.add("error-login");
				span.textContent = data.msg;
				loginForm.appendChild(span);
			}
			console.log(data);
		}
	}
});
