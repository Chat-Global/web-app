export {};
require('dotenv').config();
const csrf = require('csurf');
const axios = require('axios');
const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const { createServer } = require('http');
const { mw: reqIPMW } = require('request-ip');
const cookieParser = require('cookie-parser');

const app = express();
const server = createServer(app);

const port = process.env.PORT || 3000;

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

app.get('/', (req: any, res: any): void => {
	res.redirect('/interchat/es');
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
	const token = req.cookies.token || '';

	if (!token) return res.redirect('/login');

	if (!token.includes('.')) return res.redirect('/login');

	if (token.split('.').length !== 3) return res.redirect('/login');

	const user = token.split('.')[0];

	if (!user) return res.redirect('/login');

	const userData = await axios({
		method: 'post',
		url: `https://accounts.chatglobal.ml/authorize/user/${user}`,
		headers: {
			authorization: token
		}
	}).catch((): boolean => false);

	if (!userData) return res.redirect('/login');

	console.log('Logged in:', userData);

	res.sendFile('index.html', {
		root: join(__dirname, ' bn ./static/html/')
	});
});

// Iniciando el servidor

server.listen(app.get('port'), (): void => {
	console.log(`Server listening on port ${app.get('port')}`);
});
