<template>
	<v-container fluid>
		<v-row>
			<v-col v-for="user in users" :key="user.id" cols="12" sm="6" md="4" lg="3">
				<v-card>
					<v-row justify="space-between" dense>
						<v-col>
							<v-card-title>{{ `${user.givenname} ${user.surname}` }}</v-card-title>
						</v-col>

						<v-col cols="auto">
							<v-avatar color="teal lighten-2 mt-4 mr-4">
								<v-icon color="white">mdi-account</v-icon>
							</v-avatar>
						</v-col>
					</v-row>

					<v-list dense>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-email</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{ user.email }}</v-list-item-title>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-phone</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{ user.phone }}</v-list-item-title>
						</v-list-item>
					</v-list>

					<v-divider></v-divider>

					<v-row dense class="px-4">
						<v-col>
							<v-chip v-for="role in user.roles" :key="role.id" class="mr-2 my-2" small color="orange darken-1 white--text">{{ role.name }}</v-chip>
							<v-chip small class="my-2" @click="openRoleDialog(user)">
								<v-icon left>mdi-plus</v-icon>
								Rollen zuweisen
							</v-chip>
						</v-col>
					</v-row>

					<template v-if="user.rights && user.rights.length > 0">
						<v-divider></v-divider>
						<v-row dense class="px-4">
							<v-col>
								<v-chip v-for="right in user.rights" :key="right.id" class="mr-2 my-2" small color="primary lighten-2 white--text">{{ right.name }}</v-chip>
							</v-col>
						</v-row>
					</template>
				</v-card>
			</v-col>
			<v-col v-if="users.length === 0">
				<v-alert type="info" color="orange darken-2" border="left" colored-border elevation="1">
					Keine Benutzer vorhanden. Legen Sie Ihren ersten an!
				</v-alert>
			</v-col>
		</v-row>

		<v-btn fab fixed bottom right dark color="pink" @click="openUserDialog">
			<v-icon>mdi-plus</v-icon>
		</v-btn>

		<v-dialog v-model="showUserDialog" max-width="400" persistent>
			<user-editor @submit="createUser" @cancel="cancelUserDialog"></user-editor>
		</v-dialog>

		<v-dialog v-model="showRoleDialog" max-width="400" persistent>
			<multi-selection title="Rollenauswahl" :items="roles" display="name" @submit="assignRolesToUser" cancel="cancelRoleDialog"></multi-selection>
		</v-dialog>
	</v-container>
</template>

<script>
	import MultiSelection from '../components/MultiSelection';
	import UserEditor from '../components/UserEditor';

	export default {
		name: 'Users',
		components: {
			MultiSelection,
			UserEditor
		},
		data: () => ({
			users: [],
			showUserDialog: false,
			showRoleDialog: false,
			selectedUser: null,
			roles: []
		}),
		async created() {
			this.users = await this.$userService.getUsers();
			console.log(this.users);
		},
		methods: {
			openUserDialog() {
				this.showUserDialog = true;
			},
			cancelUserDialog() {
				this.showUserDialog = false;
			},
			createUser(user) {
				this.showUserDialog = false;
				this.$userService.createUser(user).then(createdUser => this.users.push(createdUser));
			},
			async openRoleDialog(user) {
				this.selectedUser = user;
				this.roles = await this.$userService.getRoles();
				this.showRoleDialog = true;
			},
			cancelRoleDialog() {
				this.showRoleDialog = false;
			},
			assignRolesToUser(roles) {
				this.showRoleDialog = false;
				if (roles && roles.length > 0) {
					const roleIds = roles.map(role => role.id);
					this.$userService.assignRolesToUser(this.selectedUser.id, roleIds).then(async () => {
						this.users = await this.$userService.getUsers();
					});
				}
			}
		}
	};
</script>
