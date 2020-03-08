import axios from 'axios';

const http = axios.create({
	baseURL: '/api',
	timeout: 1000 * 5
});

export default {
	getUsers() {
		return http.get('/users').then(response => response.data);
	},

	createUser(user) {
		return http.post('/users', user).then(response => response.data);
	},

	getRights() {
		return http.get('/rights').then(response => response.data);
	},

	createRight(rightName) {
		return http.post('/rights', rightName).then(response => response.data);
	},

	deleteRight(rightId) {
		return http.delete(`/rights/${rightId}`);
	},

	getRoles() {
		return http.get('/roles').then(response => response.data);
	},

	createRole(roleName) {
		return http.post('/roles', roleName).then(response => response.data);
	},

	deleteRole(roleId) {
		return http.delete(`/roles/${roleId}`);
	},

	assignRightsToRole(roleId, rightIds) {
		return http.post(`/roles/${roleId}`, rightIds);
	},

	assignRolesToUser(userId, roleIds) {
		return http.post(`/users/${userId}`, roleIds);
	}
};
