<template>
	<v-card>
		<v-card-title>{{ title }}</v-card-title>
		<v-card-text>
			<v-combobox v-model="selectedData" :items="items" multiple return-object :item-text="display"></v-combobox>
			<v-btn color="success" class="mr-4" @click="submit">
				Auswählen
			</v-btn>
			<v-btn text @click="cancel">
				Abbrechen
			</v-btn>
		</v-card-text>
	</v-card>
</template>

<script>
	// generic reusable combobox component to select objects from the given source
	export default {
		name: 'MultiSelection',
		props: {
			title: {
				type: String,
				required: true
			},
			items: {
				type: Array,
				required: true
			},
			display: {
				type: String,
				required: true
			}
		},
		data: () => ({
			selectedData: []
		}),
		methods: {
			submit() {
				this.$emit('submit', this.selectedData);
			},
			cancel() {
				this.$emit('cancel');
			}
		}
	};
</script>
