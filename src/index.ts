export {};
require('dotenv').config();
const csrf = require('csurf');
const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const admin = require('firebase-admin');
const { createServer } = require('http');
const { mw: reqIPMW } = require('request-ip');
const cookieParser = require('cookie-parser');

const serviceAccount = JSON.parse(process.env.cert);

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
app.get('/*', async (req: any, res: any): Promise<void> => {
	const sessionCookie = req.cookies.session || '';

	const userData = await admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.catch(() => false);

	if (userData) {
		console.log('Logged in:', userData.email);

		res.sendFile('index.html', {
			root: join(__dirname, './static/html/')
		});
	} else {
		res.redirect('/login');
	}
});

// Iniciando el servidor

server.listen(app.get('port'), (): void => {
	console.log(`Server listening on port ${app.get('port')}`);
});
