export {};

const csrf = require('csurf');
const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const admin = require('firebase-admin');
const { createServer } = require('http');
const { mw: reqIPMW } = require('request-ip');
const cookieParser = require('cookie-parser');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const app = express();
const server = createServer(app);

const port = process.env.PORT || 4000;

// Settings
app.set('port', port);
app.set('json spaces', 2);
app.set('views', join(__dirname, '/views'));

// Middlwares
app.use(reqIPMW());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(csrf({ cookie: true }));
app.use('/assets', express.static('./src/assets'));
app.use('/static', express.static('./src/static'));

app.all('*', (req: any, res: any, next: any): void => {
	//res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});

// API Routes
app.use('/api', require('./api/index'));

app.use('/api/spa', require('./api/spa'));

// Robots
app.get('/robots.txt', (req: any, res: any): void => {
	res.sendFile('robots.txt', { root: join(__dirname, './static/other/') });
});

app.get('/logout', (req: any, res: any): void => {
	res.clearCookie('session');
	res.redirect('/login');
});

app.get('/login', (req: any, res: any): void => {
	res.sendFile('index.html', {
		root: join(__dirname, './static/html/')
	});
});

app.get('/register', (req: any, res: any): void => {
	res.sendFile('index.html', {
		root: join(__dirname, './static/html/')
	});
});

// SPA File
app.get('/*', (req: any, res: any): void => {
	const sessionCookie = req.cookies.session || '';

	admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then((userData) => {
			console.log(
				'Logged in:',
				userData.email,
				JSON.stringify(userData, null, 2)
			);
			res.sendFile('index.html', {
				root: join(__dirname, './static/html/')
			});
		})
		.catch((e) => {
			res.redirect('/login');
		});
});

app.post('/sessionLogin', (req: any, res: any): void => {
	if (!req.body.idToken) res.status(400).send('Malformed Request');

	const idToken = req.body.idToken.toString();

	const expiresIn = 60 * 60 * 24 * 5 * 1000;

	admin
		.auth()
		.createSessionCookie(idToken, { expiresIn })
		.then(
			(sessionCookie) => {
				const options = { maxAge: expiresIn, httpOnly: true };
				res.cookie('session', sessionCookie, options);
				res.end(JSON.stringify({ status: 'success' }));
			},
			() => {
				res.status(401).send('Unauthorized.');
			}
		);
});

// Iniciando el servidor

server.listen(app.get('port'), (): void => {
	console.log(`Server listening on port ${app.get('port')}`);
});
