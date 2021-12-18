export {};

const minifyHTML = require('htmlclean');
const { minify: minifyCSS } = require('csso');
const { minify: minifyJS } = require('uglify-js');
const { readdirSync, readFileSync } = require('fs');
const { Router } = require('express');
const router = Router();

const pathToRegex = (path) =>
	new RegExp(
		`^${path
			.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
			.replace(/:(\w+)/g, '(?<$1>[^/]+)')}/?$`
	);

const getParams = (match) => {
	const values = match.result.slice(1);
	const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
		(result) => result[1]
	);

	return Object.fromEntries(
		keys.map((key, i) => {
			return [key, values[i]];
		})
	);
};

const routes = [];

for (const dir of readdirSync('./src/static/views')) {
	const dirConfig = require(`../static/views/${dir}/config.json`);

	const dirStylesheets = [];

	const dirScripts = [];

	dirConfig.stylesheets.forEach((stylesheet) => {
		dirStylesheets.push(
			minifyCSS(
				readFileSync(
					`./src/static/views/${dir}/${stylesheet}`
				).toString()
			).css
		);
	});

	dirConfig.scripts.forEach((script) => {
		dirScripts.push(
			minifyJS(
				readFileSync(`./src/static/views/${dir}/${script}`).toString()
			).code
		);
	});

	routes.push({
		path: dirConfig.path,
		dir: dir,
		body: dirConfig.body,
		scripts: dirScripts,
		stylesheets: dirStylesheets
	});
}

router.post('/', (req, res) => {
	const pathname = req.body.pathname;

	const potentialMatches = routes.map((mapRoute) => {
		return {
			route: mapRoute,
			result: pathname.match(pathToRegex(mapRoute.path))
		};
	});

	let match = potentialMatches.find(
		(potentialMatch) => potentialMatch.result !== null
	);

	if (!match) {
		match = {
			route: routes.find((routeFind) => routeFind.path == '/404'),
			result: [pathname]
		};
	}

	const route = match.route;

	const params = getParams(match);

	const body = minifyHTML(
		require(`../static/views/${route.dir}/${route.body}`)({
			pathname: pathname,
			route: route,
			params: params
		})
	);

	const html = `${body}${route.stylesheets
		.map((stylesheet) => `<style>${stylesheet}</style>`)
		.join('\n')}${route.scripts
		.map((script) => `<script>${script}</script>`)
		.join('\n')}`;

	res.json({ pathname: pathname, route: route, params: params, html: html });
});

module.exports = router;
