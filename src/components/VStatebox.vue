

<!-- VStatebox.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.statebox(
	:class="`is-in-state-${states.indexOf(state)}`"
	:style="colorscheme"

	v-mods="{ isLabelOnLeft: labelPosition === 'left' }"
	)
	input.statebox__checkbox(
		type="checkbox"
		:id="id"
		:value="value"
		:class="`is-in-state-${states.indexOf(state)}`"

		@click.left="changeState('left')"
		@click.right.prevent="changeState('right')"
		)
	label.statebox__label(
		v-if="label"
		:for="id"
		:class="`is-in-state-${states.indexOf(state)}`"

		@click.right.prevent="changeState('right')"
		) {{ label }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }     from 'vuex-pathify'

import * as obj    from '@/modules/object'
import colorscheme from '@/modules/colorscheme'

export default {
	name: 'VStatebox',

	model: {
		prop:  'modelState',
		event: 'change',
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: null,
		},
		labelPosition: {
			type: String,
			default: 'right',
			validator: v => ['left', 'right'].includes(v)
		},
		states: {
			type: Array,
			required: true,
			validator: v => v.length && v.every(elem => typeof(elem) == 'string')
		},
		modelState: {
			type: [String, Object],
			default: null,
		},
		mode: {
			type: String,
			default: 'cycle',
			validator: v => ['cycle', 'buttons', 'buttons-overwrite'].includes(v)
		},
		isDarkByDefault: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			// Get the initial state from the v-model (fall back to the first available state if it's invalid)
			state: (() => {
				const modelInitialState = obj.isObject(this.modelState)
					? (this.modelState[this.value] || this.states[0])
					: this.modelState;

				return this.states.includes(modelInitialState) ? modelInitialState : this.states[0];
			})(),
		}
	},

	computed: {
		colorscheme()
		{
			return obj.mapToObject(colorscheme, (varName, values) => values[(this.isDarkModeOn || this.isDarkByDefault) ? 1 : 0]);
		},

		...get(['isDarkModeOn']),
	},

	watch: {
		modelState: {
			handler: 'updateState',
			deep: true,
		}
	},

	methods: {
		/**
		 * Change the state according to user interaction
		 */
		changeState(button)
		{
			let index = this.states.indexOf(this.state);

			switch (this.mode)
			{
				// Cycle through the states
				case 'cycle':
					this.state = this.states[(index + 1) % this.states.length];
					break;

				// Switch to the second state on left-clicking, and to the third on right-clicking
				// Always go through the first "neutral" state when changing states
				case 'buttons':
					switch (button)
					{
						case 'left':
							this.state = this.states[(index == 0) ? 1 : 0 ];
							break;

						case 'right':
							this.state = this.states[(index == 0) ? 2 : 0 ];
							break;
					}
					break;

				// Switch to the second state on left-clicking, and to the third on right-clicking
				// Directly overwrite the previous state -- to disable you have to click again with the same button
				case 'buttons-overwrite':
					switch (button)
					{
						case 'left':
							this.state = this.states[(index == 1) ? 0 : 1 ];
							break;

						case 'right':
							this.state = this.states[(index == 2) ? 0 : 2 ];
							break;
					}
					break;
			}

			// If the v-model is linked to an object (several checkboxes sharing the same v-model)
			if (obj.isObject(this.modelState))
			{
				let newModelState = {...this.modelState};

				newModelState[this.value] = this.state;

				// Filter out the keys that are set to the first state
				let filteredModelState = obj.filter(newModelState, (key, state) => state !== this.states[0]);

				this.$emit('change', filteredModelState);

			}
			// Else if the v-model is linked to a single value (only one checkbox)
			else
			{
				this.$emit('change', this.state);
			}
		},

		/**
		 * Update the state when the parent's v-model changes
		 */
		updateState()
		{
			if (!this.modelState) return;

			// If the v-model is linked to an object
			if (obj.isObject(this.modelState))
			{
				let modelStateCopy = {...this.modelState};

				// If the state is undefined, take the first one available
				this.state = modelStateCopy[this.value] ? modelStateCopy[this.value] : this.states[0];
			}
			// Else if the v-model is linked to a single value (only one checkbox)
			else
			{
				this.state = this.modelState;
			}
		}
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/colors' as *;

.statebox {
	padding: 4px 8px;

	border: 1px solid var(--color--border);
	@include pill;

	background-color: var(--color--bg);

	transition: background-color 0.2s;

	&:hover {
		background-color: var(--color--bg--light);
	}

	&.is-label-on-left {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}

	&.is-in-state-1 { border-color: $color--malachite; }
	&.is-in-state-2 { border-color: $color--crimson;   }
}

.statebox__checkbox {
	display: none;

	&.is-in-state-1 { border-color: $color--malachite; }
	&.is-in-state-2 { border-color: $color--crimson;   }
}

.statebox__label {
	color: var(--color--text);

	cursor: pointer;
	user-select: none;

	&.is-in-state-2 {
		text-decoration-line: line-through;
	}
}

</style>
<!--}}}-->
