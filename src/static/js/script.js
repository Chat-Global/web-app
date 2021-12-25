/* eslint-disable no-undef */
const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	$('#app').html(await getHTML(location.pathname).then((data) => data.html));
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

document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (event) => {
		const link = event.target.closest('a[data-link]');
		if (link !== null) {
			event.preventDefault();
			navigateTo(link.getAttribute('href'));
		}
	});

	$('#app').css('display', 'none');

	router();

	setTimeout(() => {
		$('#app').css('display', 'block');
		$('#load-screen').remove();
	}, 2000);
});
