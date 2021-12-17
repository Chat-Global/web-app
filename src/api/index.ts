export {};

const { Router } = require('express');
const router = Router();
const version = require('../../package.json').version;

router.get('/', (req, res) => {
	res.json({ version: version });
});

module.exports = router;
