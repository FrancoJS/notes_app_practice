const token = localStorage.getItem("token");
if (!token) window.location.href = "/login-register";
const hiUser = document.getElementById("hiUser");
const addButton = document.getElementById("addButton");

// CERRAR SESION
const logout = document.getElementById("logout");
const login = document.getElementById("login");
logout.classList.remove("display-none");
login.classList.add("display-none");

logout.addEventListener("click", () => {
	if (confirm("¿Esta seguro de cerrar sesion?")) {
		localStorage.removeItem("token");
		logout.classList.add("display-none");
		login.classList.remove("display-none");
		window.location.href("/login-register");
	}
});

//OBTENER TODAS LAS NOTAS
let limit = 9;
let PAGE = 1;
const getAllNotes = async (url = `/api/notes?limit=${limit}&page=${PAGE}`) => {
	try {
		const { data } = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const { username, pagination } = data;
		const noteArr = data.msg;
		hiUser.textContent = `Hola, ${username}!`;
		showNotes(noteArr);
		updateOrDeleteNote(noteArr);
		createPagination(pagination);
	} catch ({ response }) {
		if (response) {
			const { data } = response;
			alert(data.msg);
		}
	}
};

window.changePage = function (page) {
	PAGE = page;
	getAllNotes();
};

const pagination = document.getElementById("pagination");
const createPagination = ({ totalPages, nextPage, prevPage, currentPage }) => {
	if (totalPages <= 1) return;

	pagination.innerHTML = "";
	pagination.innerHTML += `<li class="pagination-item"><button id="prevPage" class="pagination-button ${
		!prevPage ? "disabled" : ""
	}">Anterior</button></li>`;

	for (let i = 1; i <= totalPages; i++) {
		pagination.innerHTML += `<li class="pagination-item"
		}><button class="pagination-button ${currentPage === i ? "active" : ""}" onclick="changePage(${i})">${i}</button></li>`;
		console.log(currentPage === i);
	}

	pagination.innerHTML += `<li class="pagination-item "><button id="nextPage" class="pagination-button ${
		!nextPage ? "disabled" : ""
	}">Siguiente</button></li>`;
	const next = document.getElementById("nextPage");
	const prev = document.getElementById("prevPage");
	next.addEventListener("click", () => {
		getAllNotes(nextPage);
	});
	prev.addEventListener("click", () => {
		getAllNotes(prevPage);
	});
};

//AGREGAR NOTAS

addButton.addEventListener("click", (e) => {
	const formAddNote = document.getElementById("formAddNote");
	formAddNote.classList.remove("display-none");
	const closeBtn = document.getElementById("closeBtn");
	let send = true;
	closeBtn.addEventListener("click", () => {
		formAddNote.classList.add("display-none");
		send = false;
		window.location.reload();
	});
	console.log("Hola");

	formAddNote.addEventListener("submit", async (e) => {
		e.preventDefault();
		try {
			const title = e.target.title.value;
			const description = e.target.description.value;
			if (send && title && description) {
				await axios.post(
					"/api/notes/create",
					{
						title,
						description,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				window.location.reload();
				alert("Nota agregada con exito!");
			} else {
				e.target.title.value = "";
				e.target.description.value = "";
			}
		} catch ({ response }) {
			if (response) {
				const { data } = response;
				alert(data.msg);
			}
		}
	});
});

//MOSTRAR NOTAS
const containerNotes = document.getElementById("containerNotes");
const showNotes = (noteArr) => {
	containerNotes.innerHTML = "";
	containerNotes.innerHTML += `<form id="formAddNote" class="form-notes display-none">
						<div class="container-inputs">
							<span>Nota nueva:</span>
							<input type="text" id="addNote" class="title-note" placeholder="Titulo..." name="title" />
							<textarea name="description" placeholder="Descripcion..."></textarea>
						</div>
						<div class="container-buttons">
							<button id="sendBtn" class="material-symbols-outlined notes-button" type="submit">
								<span class="material-symbols-outlined">
									<span class="material-symbols-outlined"> task_alt </span>
								</span>
							</button>
							<button id="closeBtn" class="material-symbols-outlined notes-button">close</button>
						</div>
					</form>`;
	noteArr.forEach(({ n_id, title, description, date_of_creation }) => {
		containerNotes.innerHTML += `
			<form id="formNote-${n_id}" class="form-notes">
				<div class=container-inputs>
				<span class="date-note">Creación: ${date_of_creation.slice(0, 10)}</span>
				<input type="text" id="titleNote-${n_id}" class="title-note" value="${title}" name="title"/>
				<textarea name="description">${description}</textarea>
				<input class="display-none" value="${n_id}" readonly name="n_id"/>
				</div>
				<div class="container-buttons">
				<button id="refresh-${n_id}" class="material-symbols-outlined notes-button" type="submit">refresh</button>
				<button id="delete-${n_id}"class="material-symbols-outlined notes-button">delete</button>
				</div>
			</form>
		`;
	});
};

//ACTUALIZAR O BORRAR NOTA, SE OCUPA EL MISMO CICLO
const updateOrDeleteNote = (noteArr) => {
	noteArr.forEach(({ n_id }) => {
		const form = document.getElementById(`formNote-${n_id}`);
		const deleteBtn = document.getElementById(`delete-${n_id}`);
		const refreshBtn = document.getElementById(`refresh-${n_id}`);
		let put = false;
		refreshBtn.addEventListener("click", () => {
			put = true;
		});
		//ACTUALIZAR NOTAS
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			const title = e.target.title.value;
			const description = e.target.description.value;
			const n_id = e.target.n_id.value;
			if (put && confirm("¿Estas seguro de actualizar la nota?")) {
				try {
					await axios.put(
						`/api/notes/update/${n_id}`,
						{
							title,
							description,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					alert("Nota actualizada");
					window.location.reload();
				} catch ({ response }) {
					if (response) {
						const { data } = response;
						alert(data.msg);
						window.location.reload();
					}
				}
			}
		});

		//BORRAR NOTAS
		deleteBtn.addEventListener("click", async (e) => {
			if (confirm("¿Estas seguro de eliminar la nota?")) {
				try {
					await axios.delete(`/api/notes/delete/${n_id}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					window.location.reload();
				} catch (error) {
					console.log(error);
				}
			}
		});
	});
};

getAllNotes();
