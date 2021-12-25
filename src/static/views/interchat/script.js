/* eslint-disable no-undef */
(() => {
	document.title = 'Interchat';

	document.querySelectorAll('.tooltip').forEach((e) => e.remove());

	const tooltipTriggerList = [].slice.call(
		document.querySelectorAll('[data-bs-toggle="tooltip"]')
	);

	tooltipTriggerList.forEach((tooltipTriggerEl) => {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});

	const socket = io('wss://gateway.chatglobal.ml');
	const messages = document.getElementById('interchat-messages');
	const form = document.getElementById('message-form');
	const input = document.getElementById('message-input');

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (input.value.trim()) {
			socket.emit('interchat_message', {
				user: { username: 'hamilla' },
				content: input.value
			});
			input.value = '';
		}
	});

	socket.on('interchat_message', (msg) => {
		const messageHTML = /*html*/ `
		<div class="interchat-message">
			<div class="avatar-container">
				<img src="${msg.user.avatar}" class="interchat-message-avatar" alt="Avatar de ${msg.user.username}">
			</div>
			<div class="message-container">
				<div class="name-container">
					<h3><span class="user-name">${msg.user.username}</span> <span class="message-date">hoy a las 19:34</span></h3>
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
	});
})();
