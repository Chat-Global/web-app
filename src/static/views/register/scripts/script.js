/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
$(() => {
	function showErrorNotification(html) {
		$('#register_button').removeAttr('disabled');
		$('#error_notification').removeClass('hidden');
		$('#error_notification_text').html(html);
	}

	function hideErrorNotification() {
		$('#register_button').attr('disabled', 'disabled');
		$('#error_notification').addClass('hidden');
		$('#error_notification_text').html('');
	}

	document.title = 'Chat Global Register';

	tsParticles
		.loadJSON('particles-container', '/assets/particles.json')
		.catch((error) => {
			console.error(error);
		});

	$('#register').submit((event) => {
		event.preventDefault();
		hideErrorNotification();

		const { username, email, password } = event.target;

		if (!username.value || !username.value.trim()) {
			showErrorNotification('Debes introducir un nombre de usuario.');
			return false;
		}

		if (username.value.trim().length < 3) {
			showErrorNotification(
				'El nombre de usuario debe tener al menos 3 caracteres.'
			);
			return false;
		}

		if (username.value.trim().length > 20) {
			showErrorNotification(
				'El nombre de usuario no puede tener más de 20 caracteres.'
			);
			return false;
		}

		if (!email.value || !email.value.trim()) {
			showErrorNotification('Debes introducir un correo electrónico.');
			return false;
		}

		if (!password.value || !password.value.trim()) {
			showErrorNotification('Debes introducir una contraseña.');
			return false;
		}

		if (password.value.trim().length < 8) {
			showErrorNotification(
				'La contraseña debe tener al menos 8 caracteres.'
			);
			return false;
		}

		if (!$('[name=h-captcha-response]').val()) {
			showErrorNotification('Debes responder el captcha.');
			return false;
		}

		$.ajax({
			type: 'POST',
			url: 'https://accounts.chatglobal.ml/register',
			headers: {
				'CSRF-Token': Cookies.get('XSRF-TOKEN')
			},
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				credentials: {
					username: username.value.trim(),
					email: email.value.trim(),
					password: password.value.trim(),
					captchaToken: $('[name=h-captcha-response]').val()
				}
			}),
			success: (resp) => {
				localStorage.setItem('token', resp.token);
				const sessionCookie = resp.sessionCookie;
				Cookies.set(sessionCookie.name, sessionCookie.value, {
					secure: true,
					sameSite: 'lax',
					expires: 5
				});
				if (resp.redirect) {
					window.location.assign(resp.redirect);
				} else {
					window.location.assign('/');
				}
			},
			error: (resp) => {
				hcaptcha.reset();
				showErrorNotification(
					resp &&
						resp.responseJSON &&
						resp.responseJSON.messages &&
						resp.responseJSON.messages.length > 0
						? resp.responseJSON.messages
								.map((message) => `<strong>${message}</strong>`)
								.join('<br>')
						: 'Error al obtener la respuesta del servidor.'
				);
			}
		});
		return false;
	});
});
