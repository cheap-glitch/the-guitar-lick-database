

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VButton(
	:title="tooltip"
	v-mods="{ isActive, isDisabled, isOnlyIcon: !text }"

	@click.left="click"
	)
	fa-icon.VButton__icon(
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		v-mods="{ isDisabled }"
		)
	p.VButton__text(
		v-if="text"
		v-mods="{ isDisabled }"
		) {{ text }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VButton',

	props: {
		text: {
			type: [String],
			default: null,
		},
		icon: {
			type: [Array, String],
			required: true,
		},
		tooltip: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		click()
		{
			if (!this.isDisabled) this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButton {
	@include center-content;
	@include space-children-h(10px);

	@include pill;

	padding: 8px;

	border: 1px solid grey;

	cursor: pointer;
	appearance: none;

	&:hover {
		background-color: lightblue;
	}

	&.is-disabled {
		cursor: not-allowed;
		background-color: darkgray;
	}

	/**
	 * This modifier is placed below on purpose, so that when both 'isActive' and 'isDisabled'
	 * are true, the active background color is combined with the disabled cursor
	 */
	&.is-active {
		background-color: orange;
	}

	&.is-only-icon {
		width: 30px;
		height: 30px;

		border-radius: 50%;
	}
}

.VButton__icon {
	&.is-disabled {
		cursor: not-allowed;
	}
}

.VButton__text {
	cursor: pointer;

	&.is-disabled {
		cursor: not-allowed;
	}
}

</style>
<!--}}}-->
