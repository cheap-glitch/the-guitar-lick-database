

<!-- VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.select

	//- Select bar
	div.select__bar(
		v-mods="{ isDisabled }"
		v-click-outside="close"
		@click.left="toggleOpen"
		)
		p.select__bar__text(
			v-mods="{ isDisabled }"
			) {{ selected.name }}

		fa-icon.select__bar__icon(
			:icon="['far', 'chevron-down']"
			v-mods="{ isOpened, isDisabled }"
			)

	//- Options
	transition(name="fade")
		div.select__options(v-show="isOpened")
			p.select__options__item(
				v-for="option in optionsList"
				:key="`key--v-select-${id}--${option.value}`"

				@click.left="select(option)"
				) {{ option.name }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { objectMap } from '@/modules/object.js'

export default {
	name: 'VSelect',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		options: {
			type: [Array, Object],
			required: true,
		},
		value: {
			type: [Number, String],
			required: true,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpened: false,
		}
	},

	computed: {
		optionsList()
		{
			// If the options are passed as an object, build an option array from the keys and values
			return Array.isArray(this.options) ? this.options : objectMap(this.options, (_key, _value) => ({ name: _value, value: _key }));
		},
		selected()
		{
			return this?.optionsList?.find(_option => _option.value == this.value) ?? { value: 'loading', name: 'Loading…' };
		},
	},

	methods: {
		select(_option)
		{
			this.$emit('change', _option.value);
		},
		toggleOpen()
		{
			if (!this.isDisabled) this.isOpened = !this.isOpened;
		},
		close()
		{
			this.isOpened = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/transitions' as *;

.select {
	position: relative;
	flex: 1 1 auto;
}

.select__bar,
.select__options {
	border: 1px solid $color-azure;

	background-color: $color-mirage;
}

.select__bar {
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: 8px;

	cursor: pointer;

	&.is-disabled {
		border-color: gray;

		background-color: lightgray;

		cursor: not-allowed;
	}
}

.select__bar__text,
.select__bar__icon,
.select__options__item {
	color: $color-nepal;

	cursor: pointer;
	user-select: none;

	&.is-disabled {
		color: gray;

		cursor: not-allowed;
	}
}

.select__bar__icon {
	font-size: 0.8em;

	@include flip;
}

.select__options {
	overflow-y: auto;

	position: absolute;
	z-index: 1000;
	top: 100%;
	left: 0;
	right: 0;

	max-height: 300px;

	border-top: none;
}

.select__options__item {
	padding: 8px;

	&:hover {
		background-color: $color-oxford-blue;
	}

	&:not(:last-child) {
		border-bottom: 1px solid $color-ebony-clay;
	}
}

</style>
<!--}}}-->
