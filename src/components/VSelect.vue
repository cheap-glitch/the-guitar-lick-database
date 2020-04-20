

<!-- VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VSelect(ref="vselectbar")

	//- Select bar
	div.VSelect__bar(
		v-mods="{ isDisabled }"
		v-click-outside="close"
		@click.left="toggleOpen"
		)
		p.VSelect__bar__text(
			v-mods="{ isDisabled }"
			) {{ selected.name }}

		fa-icon.VSelect__bar__chevron(
			:icon="['far', 'chevron-down']"
			v-mods="{ isOpened, isDisabled, isFlipped: isChevronFlipped }"
			)

	//- Options
	transition(name="fade")
		div.VSelect__options(
			v-show="isOpened"
			v-mods="{ isOpeningDirectionUp: openingDirection == 'up' }"
			)
			p.VSelect__options__item(
				v-for="option in optionsList"
				:key="`key--v-select-${id}--${option.value}`"

				@click.left="select(option)"
				) {{ option.name }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { map as objectMap } from '@/modules/object.js'

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
			isOpened:          false,
			openingDirection:  'down',
		}
	},

	computed: {
		optionsList()
		{
			// If the options are passed as an object, build an option array from the keys and values
			return Array.isArray(this.options) ? this.options : objectMap(this.options, (key, value) => ({ name: value, value: key }));
		},
		selected()
		{
			return this?.optionsList?.find(option => option.value == this.value) ?? { value: 'loading', name: 'Loading…' };
		},
		isChevronFlipped()
		{
			return (this.openingDirection == 'down' &&  this.isOpened)
			    || (this.openingDirection == 'up'   && !this.isOpened)
		},
	},

	mounted() {
		this.updateOpeningDirection();
	},

	methods: {
		select(option)
		{
			this.$emit('change', option.value);
		},
		toggleOpen()
		{
			if (!this.isDisabled)
			{
				if (!this.isOpened)
					this.updateOpeningDirection();

				this.isOpened = !this.isOpened;
			}
		},
		close()
		{
			this.isOpened = false;
		},
		updateOpeningDirection()
		{
			const windowHeight  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			const elemYPosition = this.$refs.vselectbar.getBoundingClientRect().top;

			/**
			 * If the element is positioned low in the viewport,
			 * open the options menu upward instead of downward to avoid vertical overflow
			 */
			this.openingDirection = windowHeight - elemYPosition < 380 ? 'up' : 'down';
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/colors'      as *;
@use '@/styles/transitions' as *;

.VSelect {
	position: relative;
	flex: 1 1 auto;
}

.VSelect__bar,
.VSelect__options {
	border: 1px solid $color--azure;

	background-color: var(--color--ui--bg);
}

.VSelect__bar {
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: 8px;

	cursor: pointer;

	transition: background-color 0.2s;

	&:not(.is-disabled):hover {
		background-color: var(--color--ui--bg--hover);
	}

	&.is-disabled {
		border-color: gray;

		background-color: lightgray;

		cursor: not-allowed;
	}
}

.VSelect__bar__text,
.VSelect__bar__chevron,
.VSelect__options__item {
	color: var(--color--text-2);

	cursor: pointer;
	user-select: none;

	&.is-disabled {
		color: gray;

		cursor: not-allowed;
	}
}

.VSelect__bar__chevron {
	font-size: 0.8em;

	@include flip;
}

.VSelect__options {
	overflow-y: auto;

	position: absolute;
	z-index: 1000;
	left: 0;
	right: 0;

	max-height: 300px;

	&.is-opening-direction-up {
		bottom: 100%;
		border-bottom: none;
	}

	&:not(.is-opening-direction-up) {
		top: 100%;
		border-top: none;
	}
}

.VSelect__options__item {
	padding: 8px;

	&:hover {
		background-color: var(--color--ui--border);
	}

	&:not(:last-child) {
		border-bottom: 1px solid var(--color--ui--border-2);
	}
}

</style>
<!--}}}-->
