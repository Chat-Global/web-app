(() => {
	/* eslint-disable no-undef */
	document.title = 'Interchat';

	document.querySelectorAll('.tooltip').forEach((e) => e.remove());

	const tooltipTriggerList = [].slice.call(
		document.querySelectorAll('[data-bs-toggle="tooltip"]')
	);

	tooltipTriggerList.forEach((tooltipTriggerEl) => {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});

	connections.forEach((socketConnection) =>
		socketConnection.disconnect(true)
	);

	const socket = io('wss://gateway.chatglobal.ml', {
		auth: {
			token: localStorage.getItem('token')
		}
	});

	connections.push(socket);

	const form = document.getElementById('message-form');
	const attachmentsButton = document.getElementById('attachments-div');
	const emojisButton = document.getElementById('emojis-div');
	const submitButton = document.getElementById('send-div');
	const input = document.getElementById('message-input');
	let files = [];

	const attachFiles = async (event) => {
		event.preventDefault();

		const readURL = (file) => {
			return new Promise((res, rej) => {
				const reader = new FileReader();
				reader.onload = (e) => res(e.target.result);
				reader.onerror = (e) => rej(e);
				reader.readAsDataURL(file);
			});
		};

		const fileInput = document.createElement('input');

		fileInput.type = 'file';

		const img = document.createElement('img');

		img.attributeStyleMap.set('max-width', '320px');

		document.body.appendChild(fileInput);
		document.body.appendChild(img);

		const preview = async (e) => {
			for (const file of e.target.files) {
				const url = await readURL(file);
				files.push(url);
			}
		};

		fileInput.addEventListener('change', preview);

		console.log('File');
	};

	const addEmojis = async (event) => {
		event.preventDefault();

		$('#emojis').disMojiPicker();
		twemoji.parse(document.body);
		$('#emojis').picker((emoji) => console.log(emoji));

		console.log('Emoji');
	};

	const sendMessage = async (event) => {
		event.preventDefault();
		if (input.value.trim()) {
			socket.emit('MESSAGE_CREATE', {
				content: input.value,
				files: files
			});
			input.value = '';
		}
	};

	form.addEventListener('submit', sendMessage);
	attachmentsButton.addEventListener('click', attachFiles);
	emojisButton.addEventListener('click', addEmojis);
	submitButton.addEventListener('click', sendMessage);

	const messageFunction = (msg) => {
		const messageHTML = /*html*/ `
			<div class="interchat-message">
				<div class="avatar-container">
					<img src="${msg.author.avatar}" class="interchat-message-avatar">
				</div>
				<div class="message-container">
					<div class="name-container">
						<h5><span class="user-name">${msg.author.username}</span>${
			msg.author.system
				? ' <span class="badge bg-primary chat-badge">SISTEMA</span>'
				: ''
		} <span class="message-date">hoy a las 19:34</span></h5>
					</div>
					<div class="content-container">
						<div>${msg.content}</div>
					</div>
				</div>
			</div>
		`;

		document
			.getElementById('interchat-messages')
			.insertAdjacentHTML('beforeend', messageHTML);

		document
			.getElementById('interchat-messages-card')
			.scrollTo(
				0,
				document.getElementById('interchat-messages-card').scrollHeight
			);
	};

	socket.on('MESSAGE_CREATE', messageFunction);
})();
