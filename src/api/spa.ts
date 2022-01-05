export {};

const { minify: minifyHTML } = require('html-minifier');
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

for (const dir of readdirSync('./src/views')) {
	const dirConfig = require(`../views/${dir}/config.json`);

	const dirStylesheets = [];

	const dirScripts = [];

	dirConfig.stylesheets.forEach((stylesheet) => {
		dirStylesheets.push(
			minifyCSS(
				readFileSync(
					`./src/views/${dir}/stylesheets/${stylesheet}`
				).toString()
			).css
		);
	});

	dirConfig.scripts.forEach((script) => {
		dirScripts.push(
			minifyJS(
				readFileSync(`./src/views/${dir}/scripts/${script}`).toString()
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

	if (!match) return res.status(404).send('404: Not found.');

	const route = match.route;

	const params = getParams(match);

	const body = require(`../views/${route.dir}/${route.body}`)({
		pathname: pathname,
		route: route,
		params: params
	});

	const html = minifyHTML(body, {
		collapseWhitespace: true,
		minifyCSS: true,
		minifyJS: true
	});

	res.json({
		pathname: pathname,
		route: route,
		params: params,
		html: html,
		css: route.stylesheets,
		js: route.scripts
	});
});

router.get('/routes', (req, res) => {
	res.json(routes.map((mapRoute) => mapRoute.path));
});

module.exports = router;
