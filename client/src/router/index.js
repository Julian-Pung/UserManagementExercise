import Vue from 'vue';
import VueRouter from 'vue-router';
import Users from '../views/Users.vue';
import Rights from '../views/Rights.vue';
import Roles from '../views/Roles.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/users',
		name: 'Users',
		component: Users
	},
	{
		path: '/rights',
		name: 'Rights',
		component: Rights
	},
	{
		path: '/roles',
		name: 'Roles',
		component: Roles
	},
	{
		path: '/',
		redirect: '/users'
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
