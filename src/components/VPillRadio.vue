

<!-- VPillRadio.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.p-radio

	//- Left label
	p.p-radio__label(
		v-if="label && labelPosition == 'left'"
		v-mods="{ isDisabled }"
		) {{ label }}

	//- Choices
	div.p-radio__choice(
		v-for="(choiceValue, choiceName) in choices"
		:key="`p-radio-${choiceValue}`"
		v-mods="{ isSelected: choiceValue == value, isDisabled }"

		@click.left="select(choiceValue)"
		)
		input.p-radio__choice__input(
			type="radio"
			:id="`${fullID}--${choiceValue}`"
			:value="choiceValue"
			:checked="choiceValue == value"
			)
		label.p-radio__choice__label(
			:for="`${fullID}--${choiceValue}`"
			v-mods="{ isSelected: (choiceValue == value), isDisabled }"
			) {{ choiceName }}

	//- Right label
	p.p-radio__label(
		v-if="label && labelPosition == 'right'"
		v-mods="{ isDisabled }"
		) {{ label }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VPillRadio',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: null,
		},
		labelPosition: {
			type: String,
			default: 'left',
			validator: v => ['left', 'right'].includes(v)
		},
		choices: {
			type: Object,
			required: true,
		},
		value: {
			type: [String, Number, Boolean],
			required: true,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		fullID()
		{
			return `p-radio--${this.id}`;
		},
	},

	methods: {
		select(value)
		{
			if (!this.isDisabled) this.$emit('change', value);
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.p-radio {
	display: flex;
}

.p-radio__label {
	font-style: italic;

	user-select: none;
}

.p-radio__label,
.p-radio__choice {
	padding: 4px 8px;

	border: 1px solid $color-oxford-blue;

	white-space: nowrap;
	text-overflow: clip;

	color: $color-regent-st-blue;
	background-color: $color-ebony-clay;

	&:not(:last-child) {
		border-right: none;
	}

	&:first-child {
		border-radius: 1e3px 0 0 1e3px;
	}

	&:last-child {
		border-radius: 0 1e3px 1e3px 0;
	}

	&.is-disabled {
		cursor: not-allowed;
	}
}

.p-radio__choice {
	&:not(.is-disabled):not(.is-selected):hover {
		cursor: pointer;

		background-color: $color-oxford-blue;
	}

	&.is-selected {
		background-color: $color-malachite;
	}

	transition: background-color 0.2s;
}

.p-radio__choice__input {
	display: none;
}

.p-radio__choice__label {
	cursor: pointer;
	user-select: none;

	&.is-selected {
		color: white;
	}

	&.is-disabled {
		cursor: not-allowed;
	}
}

</style>
<!--}}}-->
