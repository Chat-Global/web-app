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
			interchat: 'es',
			token: Cookies.get('token')
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

		twemoji.parse(document.body);

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

	const isToday = (someDate) => {
		const today = new Date();
		return (
			someDate.getDate() == today.getDate() &&
			someDate.getMonth() == today.getMonth() &&
			someDate.getFullYear() == today.getFullYear()
		);
	};

	const zeroPad = (number) => {
		return number.toString().padStart(2, '0');
	};

	const getMessageHTML = (msg) => {
		const messageDate = new Date(msg.timestamp);

		const hours = zeroPad(messageDate.getHours());
		const minutes = zeroPad(messageDate.getMinutes());

		const day = zeroPad(messageDate.getDate());
		const month = zeroPad(messageDate.getMonth() + 1);
		const year = zeroPad(messageDate.getFullYear());

		return /*html*/ `
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
		} <span class="message-date">${
			isToday(messageDate)
				? `hoy a las ${hours}:${minutes}`
				: `${day}/${month}/${year}`
		}</span></h5>
					</div>
					<div class="content-container">
						<div class="message-content">${msg.content}</div>
					</div>
				</div>
			</div>
		`;
	};

	const createMessage = (msg) => {
		const messageHTML = getMessageHTML(msg);

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

	const checkConnection = () => {
		if (
			!socket.connected &&
			connections[0] &&
			socket.id === connections[0].id &&
			connections[0].id !== undefined
		) {
			sendNotification(
				'WARN',
				'No se ha podido establecer una conexión con el servidor.'
			);

			setTimeout(() => {
				if (
					!socket.connected &&
					connections[0] &&
					socket.id === connections[0].id &&
					connections[0].id !== undefined
				) {
					window.location.reload();
				}
			}, 5000);
		}
	};

	setTimeout(checkConnection, 5000);

	socket.on('MESSAGE_CREATE', createMessage);

	socket.on('error', console.error);

	socket.on('disconnect', console.log);
})();
