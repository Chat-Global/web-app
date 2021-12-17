export {};

const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const { createServer } = require('http');
const { mw: reqIPMW } = require('request-ip');

const app = express();
const server = createServer(app);

const port = process.env.PORT || 4000;

// Settings
app.set('port', port);
app.set('json spaces', 2);
app.set('views', join(__dirname, '/views'));

// Middlwares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(reqIPMW());
app.use('/assets', express.static('./src/assets'));
app.use('/static', express.static('./src/static'));

// API Routes
app.use('/api', require('./api/index'));
app.use('/api/spa', require('./api/spa'));

// SPA File
app.get('/*', (req: any, res: any): void => {
	res.sendFile('index.html', { root: join(__dirname, './static/html/') });
});

// Iniciando el servidor

server.listen(app.get('port'), (): void => {
	console.log(`Server listening on port ${app.get('port')}`);
});
