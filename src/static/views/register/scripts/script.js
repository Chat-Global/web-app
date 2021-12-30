/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
$(() => {
	document.title = 'Register';
	$('#error_notification').css('display', 'none');
	$('#register').submit((event) => {
		event.preventDefault();

		$('#register_button').attr('disabled', 'disabled');

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
					login: event.target.email.value,
					password: event.target.password.value
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
				$('#register_button').removeAttr('disabled');
				$('#error_notification').css('display', 'block');
				$('#error_notification_text').html(
					`${
						resp &&
						resp.responseJSON &&
						resp.responseJSON.messages &&
						resp.responseJSON.messages.length > 0
							? resp.responseJSON.messages
									.map(
										(message) =>
											`<strong>${message}</strong>`
									)
									.join('<br>')
							: 'Error al obtener la respuesta del servidor.'
					}`
				);
			}
		});
		return false;
	});
});
