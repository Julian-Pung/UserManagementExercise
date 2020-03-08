const sqlite = require('sqlite3').verbose();

// defines a service class to create, insert, update and delete data from the database
// all query methods return a promise to handle asynchronious database calls
class DatabaseService {
	constructor() {
		this.initialize();
	}

	// creates a new database connection
	createDbConnection() {
		return new sqlite.Database('users.db3');
	}

	// executes the given queries in a new database connection and closes it afterwards
	execute(queryFn) {
		const db = this.createDbConnection();
		try {
			db.serialize(() => queryFn(db));
		} finally {
			db.close();
		}
	}

	// maps the given object to a new object containing parameters that are valid to use in sqlite3
	prepareParams(obj) {
		let params = {};
		for (const prop in obj) {
			params[`$${prop}`] = obj[prop];
		}
		return params;
	}

	// creates the database model if it does not exist yet
	initialize() {
		this.execute(db => {
			db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, givenname TEXT, surname TEXT, email TEXT, phone TEXT)');
			db.run('CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
			db.run('CREATE TABLE IF NOT EXISTS right (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
			db.run('CREATE TABLE IF NOT EXISTS role_right (role INTEGER NOT NULL, right INTEGER NOT NULL, PRIMARY KEY(role, right), FOREIGN KEY(role) REFERENCES role(id), FOREIGN KEY(right) REFERENCES right(id))');
			db.run('CREATE TABLE IF NOT EXISTS user_role (user INTEGER NOT NULL, role INTEGER NOT NULL, PRIMARY KEY(user, role), FOREIGN KEY(user) REFERENCES user(id), FOREIGN KEY(role) REFERENCES role(id))');
		});
	}

	// utility function to shorten repeating query code patterns
	// params can be a single value, an array or a prepared object
	executeQuery(sql, params, resolveFn) {
		return new Promise((resolve, reject) => {
			this.execute(db => {
				db.run(sql, params, function(err) {
					if (err) {
						reject(err);
					} else {
						if (resolveFn) {
							resolve(resolveFn(this.lastID));
						} else {
							resolve();
						}
					}
				});
			});
		});
	}

	// utility function to shorten repeating query code patterns
	// expects a select and returns a result set
	executeQueryAll(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.execute(db => {
				db.all(sql, params, function(err, rows) {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
			});
		});
	}

	// creates a new role with the given name
	createRole(roleName) {
		return this.executeQuery('INSERT INTO role(name) VALUES (?)', roleName, roleId => ({
			id: roleId,
			name: roleName
		}));
	}

	// deletes the given role
	deleteRole(roleId) {
		return this.executeQuery('DELETE FROM role WHERE id = ?', roleId);
	}

	// returns an array containing all roles
	getRoles() {
		return this.executeQueryAll('SELECT * FROM role');
	}

	// creates a new right with the given name
	createRight(rightName) {
		return this.executeQuery('INSERT INTO right(name) VALUES (?)', rightName, rightId => ({
			id: rightId,
			name: rightName
		}));
	}

	// deletes the given right
	deleteRight(rightId) {
		return this.executeQuery('DELETE FROM right WHERE id = ?', rightId);
	}

	// returns an array containing all rights
	getRights() {
		return this.executeQueryAll('SELECT * FROM right');
	}

	// creates a new user with the given attributes
	// the user object is expected to have the attributes givenname, surname, email, phone
	createUser(user) {
		return this.executeQuery('INSERT INTO user (givenname, surname, email, phone) VALUES ($givenname, $surname, $email, $phone)', this.prepareParams(user), userId => ({
			...user,
			id: userId
		}));
	}

	// deletes the given user
	deleteUser(userId) {
		return this.executeQuery('DELETE FROM user WHERE id = ?', userId);
	}

	// returns an array containing all users from the datbabase including assigned roles and rights
	getUsers() {
		return this.executeQueryAll("SELECT user.*, user.id AS [id], user.givenname || ' ' || user.surname AS fullname FROM user").then(async users => {
			for (let user of users) {
				const roles = await this.executeQueryAll('SELECT role AS [id], role.name FROM user_role INNER JOIN role ON user_role.role = role.id WHERE user_role.user = ?', user.id);
				user.roles = roles;
				const rights = await this.executeQueryAll(
					`
					SELECT right.id AS [id], right.name
					FROM user_role
					INNER JOIN role ON role.id = user_role.role
					INNER JOIN role_right ON role_right.role = role.id
					INNER JOIN right ON right.id = role_right.right
					WHERE user_role.user = ?`,
					user.id
				);
				user.rights = rights;
			}
			return users;
		});
	}

	// assigns all rights in the given array to the given role
	assignRightsToRole(roleId, rightIds) {
		let count = 0;
		let max = rightIds.length;
		return new Promise((resolve, reject) => {
			this.execute(db => {
				const insertStatement = db.prepare('INSERT OR IGNORE INTO role_right (role, right) VALUES (?, ?)');
				for (const rightId of rightIds) {
					insertStatement.run([roleId, rightId], err => {
						if (err) {
							reject(err);
						} else {
							count++;
							if (count === max) {
								resolve();
							}
						}
					});
				}
				insertStatement.finalize();
			});
		});
	}

	// assigns all roles in the given array to the given user
	assignRolesToUser(userId, roleIds) {
		let count = 0;
		let max = roleIds.length;
		return new Promise((resolve, reject) => {
			this.execute(db => {
				const insertStatement = db.prepare('INSERT OR IGNORE INTO user_role (user, role) VALUES (?, ?)');
				for (const roleId of roleIds) {
					insertStatement.run([userId, roleId], err => {
						if (err) {
							reject(err);
						} else {
							count++;
							if (count === max) {
								resolve();
							}
						}
					});
				}
				insertStatement.finalize();
			});
		});
	}
}

module.exports = new DatabaseService();
