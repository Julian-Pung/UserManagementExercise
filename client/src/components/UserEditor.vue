<template>
	<v-card>
		<v-card-title>Benutzer</v-card-title>
		<v-card-text>
			<v-form>
				<v-text-field v-model="user.givenname" label="Vorname" prepend-icon="mdi-account-details"></v-text-field>
				<v-text-field v-model="user.surname" label="Nachname" prepend-icon="mdi-account-details"></v-text-field>
				<v-text-field v-model="user.email" label="Email" prepend-icon="mdi-email"></v-text-field>
				<v-text-field v-model="user.phone" label="Telefon" prepend-icon="mdi-phone"></v-text-field>
				<v-btn color="success" class="mr-4" @click="submit">
					Speichern
				</v-btn>
				<v-btn text @click="cancel">
					Abbrechen
				</v-btn>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		name: 'UserEditor',
		props: {
			user: {
				type: Object,
				default: () => ({})
			}
		},
		data: () => ({}),
		methods: {
			submit() {
				this.$emit('submit', this.user);
			},
			cancel() {
				this.$emit('cancel');
			}
		}
	};
</script>
