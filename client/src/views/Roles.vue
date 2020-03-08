<template>
	<v-container fluid>
		<v-row>
			<v-col>
				<v-card>
					<v-card-title>Rollen</v-card-title>
					<v-card-subtitle>Definieren Sie Rollen, die an Benutzer vergeben werden und diesen die hinterlegten Berechtigungen gewähren.</v-card-subtitle>
					<v-container fluid class="pa-4">
						<v-row>
							<v-col xs="12" md="6" lg="4">
								<v-text-field filled rounded dense label="Name der Rolle" append-outer-icon="mdi-add" v-model="roleName">
									<template v-slot:append-outer>
										<v-btn color="primary" @click="createRole">Hinzufügen</v-btn>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
					</v-container>
					<v-divider class="mx-4" />
					<v-container fluid class="pa-4">
						<v-row>
							<v-col>
								<div>Wählen Sie eine Rolle aus, um Aktionen auszuwählen.</div>
							</v-col>
						</v-row>
						<v-row>
							<v-col xs="12" md="6">
								<v-menu v-for="role in roles" :key="role.id" transition="scale-transition" origin="top left">
									<template v-slot:activator="{ on }">
										<v-chip v-on="on" class="mr-2" dark color="orange darken-1">{{ role.name }}</v-chip>
									</template>
									<v-card dark width="300" color="amber darken-3">
										<v-card-title>{{ role.name }}</v-card-title>
										<v-card-actions class="white">
											<v-btn text light @click="openRightsDialog(role)">Berechtigungen zuweisen</v-btn>
											<v-spacer></v-spacer>
											<v-btn icon @click="deleteRole(role)">
												<v-icon color="grey darken-4">mdi-close-circle</v-icon>
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-menu>
							</v-col>
						</v-row>
					</v-container>
				</v-card>
			</v-col>
		</v-row>

		<v-dialog v-model="showRightsDialog" max-width="400" persistent>
			<multi-selection title="Berechtigungen" :items="rights" display="name" @submit="assignRightsToRole" @cancel="cancelRightsDialog"></multi-selection>
		</v-dialog>
	</v-container>
</template>

<script>
	import MultiSelection from '../components/MultiSelection';

	export default {
		name: 'Roles',
		components: {
			MultiSelection
		},
		data: () => ({
			roles: [],
			roleName: '',
			showRightsDialog: false,
			selectedRole: null,
			rights: []
		}),
		async created() {
			this.roles = await this.$userService.getRoles();
		},
		methods: {
			createRole() {
				if (this.roleName) {
					this.$userService.createRole({ name: this.roleName }).then(role => {
						this.roles.push(role);
						this.roleName = '';
					});
				}
			},
			deleteRole(role) {
				// preferably with modal dialog before actually deleting it
				this.$userService.deleteRole(role.id).then(() => {
					for (let i = 0; i < this.roles.length; i++) {
						if (this.roles[i] === role) {
							this.roles.splice(i, 1);
							break;
						}
					}
				});
			},
			async openRightsDialog(selectedRole) {
				this.selectedRole = selectedRole;
				this.rights = await this.$userService.getRights();
				this.showRightsDialog = true;
			},
			cancelRightsDialog() {
				this.showRightsDialog = false;
			},
			assignRightsToRole(rights) {
				this.showRightsDialog = false;
				if (rights && rights.length > 0) {
					const rightIds = rights.map(right => right.id);
					this.$userService.assignRightsToRole(this.selectedRole.id, rightIds);
				}
			}
		}
	};
</script>
