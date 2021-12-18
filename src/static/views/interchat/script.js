/* eslint-disable no-undef */
document.title = 'Interchat';

const socket = io('wss://interchatwebserver.tnfangel.repl.co');
const messages = document.getElementById('interchat-messages');
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	if (input.value) {
		socket.emit('interchat_message', input.value);
		input.value = '';
	}
});

socket.on('interchat_message', (msg) => {
	const messageHTML = /*html*/ `
		<div class="interchat-message">
			<div class="avatar-container">
				<img src="https://cdn.discordapp.com/avatars/642914902163587083/62d93c58c702df9ae978ab5009da03f7.png?size=1024" class="interchat-message-avatar" alt="Avatar de papu">
			</div>
			<div class="message-container">
				<div class="name-container">
					<h3><span class="user-name">P4rkr bobaso</span> <span class="message-date">hoy a las 19:34</span></h3>
				</div>
				<div class="content-container">
					<div>${msg}</div>
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
