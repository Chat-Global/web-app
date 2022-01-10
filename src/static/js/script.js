/* eslint-disable no-undef */
const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const getHTML = async (pathname) => {
	return new Promise((resolve, reject) => {
		fetch('/api/spa', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ pathname: pathname })
		})
			.then((response) => response.json())
			.then((data) => {
				return resolve(data);
			})
			.catch((error) => {
				return reject(error);
			});
	});
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

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', async () => {
	document.body.addEventListener('click', (event) => {
		const link = event.target.closest('a[data-link]');
		if (link !== null) {
			event.preventDefault();
			navigateTo(link.getAttribute('href'));
		}
	});

	document.getElementById('app').style.display = 'none';

	await router();

	setTimeout(() => {
		document.getElementById('app').style.display = 'block';
		document.getElementById('load-screen').remove();
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
