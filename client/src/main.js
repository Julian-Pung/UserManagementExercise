import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import userService from './services/userService';

Vue.config.productionTip = false;

// inject the service as part of the vue prototype
Vue.prototype.$userService = userService;

new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount('#app');
