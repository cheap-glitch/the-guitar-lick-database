

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VButton(
	:title="tooltip"
	:style="colorscheme"
	v-mods="{ isActive, isDisabled, isOnlyIcon: !text }"

	@click.left="click"
	)
	fa-icon.VButton__icon(
		v-if="icon"
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

import { get }         from 'vuex-pathify'

import colorscheme     from '@/modules/colorscheme'
import { mapToObject } from '@/modules/object'

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
		isDarkByDefault: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		colorscheme()
		{
			return mapToObject(colorscheme, (varName, values) => values[(this.isDarkModeOn || this.isDarkByDefault) ? 1 : 0]);
		},

		...get(['isDarkModeOn']),
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
	@include space-children-h(8px);

	@include pill;

	padding: 4px 8px;

	appearance: none;

	border: 1px solid var(--color--ui--border);

	color: var(--color--ui--text);
	background-color: var(--color--ui--bg);

	cursor: pointer;

	transition: background-color 0.2s;

	&:hover:not(.is-disabled) {
		background-color: var(--color--ui--bg--hover);
	}

	&.is-disabled {
		cursor: not-allowed;
	}

	/**
	 * This modifier is placed below on purpose, so that when both 'isActive' and 'isDisabled'
	 * are true, the active background color is combined with the disabled cursor
	 */
	&.is-active {
		background-color: var(--color--ui--bg--highlight);
	}

	&.is-only-icon {
		@include square(35px);
		padding: 0;

		border-radius: 50%;

		.VButton__icon {
			font-size: 1.6rem;
		}
	}
}

.VButton__icon {
	font-size: 1.3rem;

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
