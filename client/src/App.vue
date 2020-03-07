<template>
	<v-app>
		<v-app-bar app color="primary" dark clipped-left>
			<v-toolbar-title>User Management</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>

		<v-navigation-drawer app clipped>
			<v-list dense>
				<v-list-item v-for="item in menuItems" :key="item.title" link>
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-content class="grey lighten-3">
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	export default {
		name: 'App',
		data: () => ({
			menuItems: [
				{
					icon: 'mdi-account',
					title: 'Benutzer'
				},
				{
					icon: 'mdi-account-box-outline',
					title: 'Rollen'
				},
				{
					icon: 'mdi-security',
					title: 'Berechtigungen'
				}
			]
		})
	};
</script>
