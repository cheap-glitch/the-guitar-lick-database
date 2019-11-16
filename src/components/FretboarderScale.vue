

<!-- FretboarderScale.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboarderScale

	//- Scale type, tonality & position
	div.options
		select(
			:value="type"
			@change="updateType"
			)
			option(value="scale") Scale
			option(value="arpeggio") Arpeggio
		select(
			:value="model"
			@change="$emit('update:model', $event.target.value)"
			)
			option(
				v-for="(model, key) in models"
				:key="key"
				:value="key"
				) {{ model.name }}
		select(
			:value="tonality"
			@change="$emit('update:tonality', $event.target.value)"
			)
			option(
				v-for="(note, index) in notes"
				:key="index"
				:value="note"
				) {{ prettifyName(note) }}

	//- Focus, show/hide & remove scale
	div.tools
		fa-icon.button.tools__item(
			:icon="['far', isVisible ? 'eye' : 'eye-slash']"
			:title="isVisible ? 'Hide' : 'Show'"
			@click.left="$emit('update:isVisible', !isVisible)"
			)
		fa-icon.button.tools__item(
			:icon="['far', 'bullseye']"
			title="Focus"
			@click.left="$emit('focus-scale', id)"
			)
		fa-icon.button.tools__item(
			:icon="['far', 'trash-alt']"
			title="Remove"
			@click.left="$emit('remove-scale', id)"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import Data from '@/modules/data';
import Note from '@/modules/note';

export default {
	name: 'FretboarderScale',

	props: {
		id: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator: _v => ['arpeggio', 'scale'].includes(_v)
		},
		model: {
			type: String,
			required: true,
		},
		tonality: {
			type: String,
			required: true,
		},
		isVisible: {
			type: Boolean,
			required: true,
		},
	},

	static() {
		return {
			notes: Data.notes,
		}
	},

	computed: {
		models()
		{
			return (this.type == 'scale') ? Data.scales : Data.arpeggios;
		}
	},

	methods: {
		updateType(_event)
		{
			// Reset the model when the type of sequence is changed
			this.$emit('update:model', 'maj');

			// Update the type
			this.$emit('update:type', _event.target.value);
		},
		prettifyName: Note.prettifyName,
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

@import '@/styles/fretboarder';

.FretboarderScale {
	display: flex;
	align-items: center;
	justify-content: space-between;
	@include space-children-h(40px);

	width: 600px;

	padding: 10px;

	border: solid lightgray 2px;
	border-radius: 10px;
}

.tools,
.options {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.tools__item {
	font-size: 20px;

	color: gray;
}

</style>
<!--}}}-->
