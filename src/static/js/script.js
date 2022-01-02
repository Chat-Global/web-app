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

const connections = [];
