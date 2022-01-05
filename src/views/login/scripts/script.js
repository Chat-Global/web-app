/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
$(() => {
	function showErrorNotification(html) {
		$('#login_button').removeAttr('disabled');
		$('#error_notification').removeClass('hidden');
		$('#error_notification_text').html(html);
	}

	function hideErrorNotification() {
		$('#login_button').attr('disabled', 'disabled');
		$('#error_notification').addClass('hidden');
		$('#error_notification_text').html('');
	}

	document.title = 'Chat Global Login';

	tsParticles
		.loadJSON('particles-container', '/assets/particles.json')
		.catch((error) => {
			console.error(error);
		});

	$('#login').submit((event) => {
		event.preventDefault();
		hideErrorNotification();

		const { email, password } = event.target;

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
			url: 'https://accounts.chatglobal.ml/login',
			headers: {
				'CSRF-Token': Cookies.get('XSRF-TOKEN')
			},
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				credentials: {
					login: email.value.trim(),
					password: password.value.trim(),
					captchaToken: $('[name=h-captcha-response]').val()
				}
			}),
			success: (resp) => {
				Cookies.set('token', resp.token, {
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
