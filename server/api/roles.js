/*

Deploys the following routes:

/roles				GET		> get all roles
/roles/:id			GET		> get the role with the given id
/roles				POST	> create a new role
/roles/:id			DELETE	> delete the role with the given id
/roles/:id/rights	POST	> assign one or more rights to the role

*/

const router = require('express').Router();
const db = require('../db/database');

// get all roles
router.get('/', (req, res) => {
	db.getRoles()
		.then(roles => res.json(roles))
		.catch(error => res.status(500).json({ error }));
});

// get the role with the given id
router.get('/:id', (req, res) => {
	const roleId = req.params.id;
	// todo when used
});

// create a new role
router.post('/', (req, res) => {
	const roleName = req.body;
	db.createRole(roleName)
		.then(newRole => res.json(newRole))
		.catch(error => res.status(500).json({ error }));
});

// delete the role with the given id
router.delete('/:id', (req, res) => {
	const roleId = req.params.id;
	db.deleteRole(roleId)
		.then(() => res.sendStatus(200))
		.catch(error => res.status(500).json({ error }));
});

// assign one or more rights to the role
router.post('/:id', (req, res) => {
	const roleId = req.params.id;
	const rightIds = req.body;
	db.assignRightsToRole(roleId, rightIds)
		.then(() => res.sendStatus(200))
		.catch(error => res.status(500).json({ error }));
});

module.exports = router;
