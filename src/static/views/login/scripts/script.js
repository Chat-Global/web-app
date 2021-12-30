/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
document.title = 'Log in';
$(() => {
	$('#error_notification').css('display', 'none');
	$('#login').submit((event) => {
		event.preventDefault();

		$('#login_button').attr('disabled', 'disabled');

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
					login: event.target.email.value,
					password: event.target.password.value
				}
			}),
			success: (resp) => {
				if (resp && resp.responseJSON && resp.responseJSON.redirect) {
					localStorage.setItem('token', resp.responseJSON.token);
					const sessionCookie = resp.responseJSON.sessionCookie;
					document.cookie = `${sessionCookie.name}=${sessionCookie.value}; max-age=${sessionCookie.maxAge}; SameSite=lax; Secure`;
					window.location.assign(resp.responseJSON.redirect);
				} else {
					window.location.assign('/');
				}
			},
			error: (resp) => {
				$('#login_button').removeAttr('disabled');
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
