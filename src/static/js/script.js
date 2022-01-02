/* eslint-disable no-undef */
const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const data = await getHTML(location.pathname);
	document.getElementById('app').innerHTML = `${data.html}${data.css
		.map((stylesheet) => `<style>${stylesheet}</style>`)
		.join('')}`;
	data.js.forEach((code) => {
		const script = document.createElement('script');
		script.innerHTML = code;
		document.body.appendChild(script);
	});
	twemoji.parse(document.body);
};

const getHTML = async (pathname) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: '/api/spa',
			type: 'POST',
			data: { pathname: pathname },
			success: (data) => {
				resolve(data);
			},
			error: (error) => {
				reject(error);
			}
		});
	});
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', async () => {
	document.body.addEventListener('click', (event) => {
		const link = event.target.closest('a[data-link]');
		if (link !== null) {
			event.preventDefault();
			navigateTo(link.getAttribute('href'));
		}
	});

	$('#app').css('display', 'none');

	await router();

	setTimeout(() => {
		$('#app').css('display', 'block');
		$('#load-screen').remove();
	}, 2000);
});

const sendNotification = (type, message) => {
	const colors = {
		primary: '#5865F2',
		success: '#57F287',
		error: '#ED4245',
		warn: '#EB8634'
	};

	const notificationContainer = document.getElementById(
		'notification-container'
	);

	const notificationID = `notification-${type.toLowerCase()}-${new Date().getTime()}-${Math.random()}`;

	notificationContainer.insertAdjacentHTML(
		'beforeend',
		/* html */ `
			<div class="toast align-items-center text-white border-0" role="alert" style="background-color: ${
				colors[type.toLowerCase()]
			};" aria-live="assertive" aria-atomic="true" id="${notificationID}">
				<div class="d-flex">
					<div class="toast-body" style="white-space: initial;">
						${message}
					</div>
					<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
				</div>
			</div>
		`
	);

	const toastElement = document.getElementById(notificationID);

	const toast = new bootstrap.Toast(toastElement);

	toast.show();

	console.log(
		`%cChatGlobalNotificationHandler => [${type.toUpperCase()}] ${message}`,
		`background-color: ${colors[type.toLowerCase()]};`
	);

	return toast;
};

const connections = [];
