const token = localStorage.getItem("token");
if (!token) window.location.href = "/login-register";

const containerNotes = document.getElementById("container-notes");
const getAllNotes = async () => {
	try {
		const { data } = await axios.get("/api/notes", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const noteArr = data.msg;
		updateNotes(noteArr);
	} catch ({ response }) {
		if (response) {
			const { data } = response;
			alert(data.msg);
		}
	}
};

const updateNotes = async (noteArr) => {
	noteArr.forEach(({ n_id, title, description, date_of_creation }) => {
		containerNotes.innerHTML += `
			<form id="formNote-${n_id}" class="form-notes">
				<span>${date_of_creation.slice(0, 10)}</span>
				<input type="text" value="${title}" name="title"/>
				<input type="text" value="${description}" name="description"/>
				<input class="display-none" value="${n_id}" name="n_id"/>
				<button id="button-${n_id}" class="form-button" type="submit">ACTUALIZAR</button>
			</form>
		`;
	});

	noteArr.forEach(({ n_id }) => {
		const form = document.getElementById(`formNote-${n_id}`);
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
			} catch ({ response }) {
				if (response) {
					const { data } = response;
					alert(data.msg);
				}
			}
		});
	});
};

getAllNotes();
