

<!-- VNumberInput.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VNumberInput
	label.VNumberInput__inner-label(
		v-if="labelLeft"
		:for="`v-number-input--${id}`"
		) {{ labelLeft }}

	input.VNumberInput__input(
		type="text"
		size="2"
		maxlength="3"

		:id="`v-number-input--${id}`"
		:value="value"

		@change="changeValue($event.target.value)"
	)

	label.VNumberInput__inner-label(
		v-if="labelRight"
		:for="`v-number-input--${id}`"
		) {{ labelRight }}

	div.VNumberInput__toolbar
		fa-icon.VNumberInput__toolbar__button(
			title="Decrease by 1\nShift + click: decrease by 5\nCtrl + click: decrease by 10"
			:icon="['far', 'minus']"
			@click.left="decrementValue($event)"
			)
		fa-icon.VNumberInput__toolbar__button(
			title="Increase by 1\nShift + click: increase by 5\nCtrl + click: increase by 10"
			:icon="['far', 'plus']"
			@click.left="incrementValue($event)"
			)
		fa-icon.VNumberInput__toolbar__button(
			title="Reset to starting value"
			:icon="['far', 'undo-alt']"
			@click.left="$emit('input', defaultValue)"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VNumberInput',

	model: {
		prop:  'value',
		event: 'input',
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			required: true,
		},
		defaultValue: {
			type: Number,
			required: true,
		},
		labelLeft: {
			type: String,
			default: null,
		},
		labelRight: {
			type: String,
			default: null,
		},
		min: {
			type: Number,
			default: null,
		},
		max: {
			type: Number,
			default: null,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		changeValue(rawValue)
		{
			let value = parseInt(rawValue);

			if (Number.isNaN(value))               value = this.defaultValue;
			else if (this.max && value > this.max) value = this.max;
			else if (this.min && value < this.min) value = this.min;

			this.$emit('input', value);
		},
		incrementValue(event)
		{
			const inc = event.ctrlKey ? 10 : (event.shiftKey ? 5 : 1);
			this.$emit('input', (this.max && this.value + inc > this.max) ? this.max : this.value + inc);
		},
		decrementValue(event)
		{
			const inc = event.ctrlKey ? 10 : (event.shiftKey ? 5 : 1);
			this.$emit('input', (this.min && this.value - inc < this.min) ? this.min : this.value - inc);
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VNumberInput {
	display: flex;
	align-items: center;

	padding: 0 10px;

	border: 1px solid $color-ebony-clay-2;

	background-color: $color-mirage;
}

.VNumberInput__input {
	padding: 5px;

	appearance: none;
	border: none;

	color: $color-regent-st-blue;
	background-color: $color-mirage;

	&::selection {
		color: $color-mirage;
		background-color: $color-regent-st-blue;
	}
}

.VNumberInput__inner-label {
	margin-right: 10px;

	color: $color-oxford-blue;
}

.VNumberInput__toolbar {
	padding: 5px 0 5px 8px;

	border-left: 1px solid $color-ebony-clay-2;
}

.VNumberInput__toolbar__button {
	@include square(24px);

	padding: 6px;

	border-radius: 50%;

	color: $color-nepal;

	cursor: pointer;

	&:hover {
		background-color: $color-oxford-blue;
	}
}

</style>
<!--}}}-->
