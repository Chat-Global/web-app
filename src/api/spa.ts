export {};

const { minify } = require('html-minifier');
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
			readFileSync(
				`./src/static/views/${dir}/stylesheets/${stylesheet}`
			).toString()
		);
	});

	dirConfig.scripts.forEach((script) => {
		dirScripts.push(
			readFileSync(
				`./src/static/views/${dir}/scripts/${script}`
			).toString()
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

	const body = require(`../static/views/${route.dir}/${route.body}`)({
		pathname: pathname,
		route: route,
		params: params
	});

	const html = minify(
		`${body}${route.stylesheets.join('\n')}${route.scripts.join('\n')}`,
		{
			minifyCSS: true,
			minifyJS: true
		}
	);

	res.json({ pathname: pathname, route: route, params: params, html: html });
});

module.exports = router;
