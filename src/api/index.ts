export {};

const { Router } = require('express');
const router = Router();
const { version } = require('../../package.json');

router.get('/', (req: any, res: any): void => {
	res.json({ version: version });
});

module.exports = router;
