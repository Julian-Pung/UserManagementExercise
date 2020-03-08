<template>
	<v-container fluid>
		<v-row>
			<v-col>
				<v-card>
					<v-card-title>Berechtigungen</v-card-title>
					<v-card-subtitle>Definieren Sie Berechtigungen, die an Rollen zugewiesen und über diese verteilt werden können</v-card-subtitle>
					<v-container fluid class="pa-4">
						<v-row>
							<v-col xs="12" md="6" lg="4">
								<v-text-field filled rounded dense label="Name der Berechtigung" append-outer-icon="mdi-add" v-model="rightName">
									<template v-slot:append-outer>
										<v-btn color="primary" @click="createRight">Hinzufügen</v-btn>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
					</v-container>
					<v-divider class="mx-4" />

					<v-container fluid class="pa-4">
						<v-row>
							<v-col xs="12" md="6">
								<v-chip v-on="on" class="mr-2" dark color="orange darken-1" v-for="right in rights" :key="right.id" close @click:close="deleteRight(right)">{{ right.name }}</v-chip>
							</v-col>
							<v-col xs="12" md="6"></v-col>
						</v-row>
					</v-container>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'Rights',
		data: () => ({
			rights: [],
			rightName: ''
		}),
		async created() {
			this.rights = await this.$userService.getRights();
		},
		methods: {
			createRight() {
				if (this.rightName) {
					this.$userService.createRight({ name: this.rightName }).then(right => {
						this.rights.push(right);
						this.rightName = '';
					});
				}
			},
			deleteRight(right) {
				// preferably with modal dialog before actually deleting it
				this.$userService.deleteRight(right.id).then(() => {
					for (let i = 0; i < this.rights.length; i++) {
						if (this.rights[i] === right) {
							this.rights.splice(i, 1);
							break;
						}
					}
				});
			}
		}
	};
</script>
