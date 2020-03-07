/*

Deploys the following routes:

/rights				GET		> get all rights
/rights/:id			GET		> get the right with the given id
/rights				POST	> create a new right
/rights/:id			DELETE	> delete the right with the given id

*/

const router = require('express').Router();
const db = require('../db/database');

// get all rights
router.get('/', (req, res) => {
	db.getRights()
		.then(rights => res.json(rights))
		.catch(error => res.status(500).json({ error }));
});

// get the right with the given id
router.get('/:id', (req, res) => {
	const rightId = req.params.id;
	// todo when used
});

// create a new right
router.post('/', (req, res) => {
	const rightName = req.body;
	db.createRole(rightName)
		.then(newRight => res.json(newRight))
		.catch(error => res.status(500).json({ error }));
});

// delete the right with the given id
router.delete('/:id', (req, res) => {
	const rightId = req.params.id;
	db.deleteRole(rightId)
		.then(() => res.sendStatus(200))
		.catch(error => res.status(500).json({ error }));
});

module.exports = router;
