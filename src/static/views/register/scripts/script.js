/* eslint-disable no-undef */
document.title = 'Register';

$('#register').submit((event) => {
	event.preventDefault();

	fetch('https://accounts.chatglobal.ml/register', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'CSRF-Token': Cookies.get('XSRF-TOKEN')
		},
		body: JSON.stringify({
			credentials: {
				login: event.target.email.value,
				password: event.target.password.value
			}
		})
	})
		.then(() => {
			window.location.assign('/interchat/es');
		})
		.catch(() => false);

	return false;
});
