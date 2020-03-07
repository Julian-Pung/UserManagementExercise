/*

Deploys the following routes:

/users				GET		> get all users
/users/:id			GET		> get the user with the given id
/users				POST	> create a new user
/users/:id			DELETE	> delete the user with the given id
/users/:id/roles	POST	> assign one or more roles to the user

*/

const router = require('express').Router();
const db = require('../db/database');

// get all users
router.get('/', (req, res) => {
	db.getUsers()
		.then(users => res.json(users))
		.catch(error => res.status(500).json({error}));
});

// get the user with the given id
router.get('/:id', (req, res) => {
	const userId = req.params.id;
	// todo when used
});

// create a new user
router.post('/', (req, res) => {
	const user = req.body;
	db.createUser(user)
		.then(newUser => res.json(newUser))
		.catch(error => res.status(500).json({error}));
});

// delete the user with the given id
router.delete('/:id', (req, res) => {
	const userId = req.params.id;
	db.deleteUser(userId)
		.then(() => res.sendStatus(200))
		.catch(error => res.status(500).json({error}));
});

// assign one or more roles to the user
router.post('/:id', (req, res) => {
	const userId = req.params.id;
	const roleIds = req.body;
	db.assignRolesToUser(userId, roleIds)
		.then(() => res.sendStatus(200))
		.catch(error => res.status(500).json({error}));
});

module.exports = router;