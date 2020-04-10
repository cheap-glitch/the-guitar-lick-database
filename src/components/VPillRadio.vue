

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

	background-color: var(--test);
}

.p-radio__label {
	font-style: italic;

	user-select: none;
}

.p-radio__label,
.p-radio__choice {
	padding: 3px;

	border: 1px solid gray;

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
	cursor: pointer;

	&:not(.is-disabled):hover {
		background-color: lightgray;
	}

	&.is-selected {
		background-color: green;
	}
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
