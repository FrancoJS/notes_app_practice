const token = localStorage.getItem("token");
if (!token) window.location.href = "/login-register";
const hiUser = document.getElementById("hiUser");
const getAllNotes = async () => {
	try {
		const { data } = await axios.get("/api/notes", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const { user } = data;
		const noteArr = data.msg;
		hiUser.textContent = `Hola, ${user}!`;
		showNotes(noteArr);
		updateOrDeleteNote(noteArr);
	} catch ({ response }) {
		if (response) {
			const { data } = response;
			alert(data.msg);
		}
	}
};

const containerNotes = document.getElementById("containerNotes");
const showNotes = (noteArr) => {
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
					<button id="delete-${n_id}"class="material-symbols-outlined notes-button">delete</button>
					<button id="button-${n_id}" class="material-symbols-outlined notes-button" type="submit">refresh</button>
				</div>
			</form>
		`;
	});
};

const updateOrDeleteNote = (noteArr) => {
	noteArr.forEach(({ n_id }) => {
		const form = document.getElementById(`formNote-${n_id}`);
		const deleteBtn = document.getElementById(`delete-${n_id}`);

		//ACTUALIZAR NOTAS
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			const title = e.target.title.value;
			const description = e.target.description.value;
			const n_id = e.target.n_id.value;
			try {
				const { data } = await axios.put(
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
				window.location.href = "/notes";
			} catch ({ response }) {
				if (response) {
					const { data } = response;
					alert(data.msg);
					window.location.href = "/notes";
				}
			}
		});

		//BORRAR NOTAS
		deleteBtn.addEventListener("click", async (e) => {
			try {
				const { data } = await axios.delete(`/api/notes/delete/${n_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				window.location.reload();
			} catch (error) {
				console.log(error);
			}
		});
	});
};

getAllNotes();
