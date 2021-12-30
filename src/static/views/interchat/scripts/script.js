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
			token: 'pene'
		}
	});

	connections.push(socket);

	const form = document.getElementById('message-form');
	const input = document.getElementById('message-input');

	const sendMessage = async (event) => {
		event.preventDefault();
		if (input.value.trim()) {
			socket.emit('MESSAGE_CREATE', {
				content: input.value
			});
			input.value = '';
		}
	};

	form.addEventListener('submit', sendMessage);

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
