

<!-- VStatebox.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.statebox(
	:class="`is-in-state-${states.indexOf(state)}`"
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

import { isObject, checkObjectProp, objectFilter } from '@/modules/object'

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
	},

	data() {
		return {
			// Get the initial state from the v-model (fall back to the first available state if it's invalid)
			state: this.states.includes(isObject(this.modelState) ? (this.modelState[this.value] || this.states[0]) : this.modelState)
			     ? this.modelState
			     : this.states[0]
		}
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
			if (isObject(this.modelState))
			{
				let newModelState = {...this.modelState};

				newModelState[this.value] = this.state;

				// Filter out the keys that are set to the first state
				let filteredModelState = objectFilter(newModelState, (key, state) => state !== this.states[0]);

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
			if (isObject(this.modelState))
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

.statebox {
	padding: 3px;

	border: 1px solid gray;
	@include pill;

	&.is-label-on-left {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}

	&.is-in-state-0 {}
	&.is-in-state-1 { background-color: green; }
	&.is-in-state-2 { background-color: red;   }
}

.statebox__checkbox {
	display: none;

	&.is-in-state-0 { background-color: white; }
	&.is-in-state-1 { background-color: green; }
	&.is-in-state-2 { background-color: red;   }
}

.statebox__label {
	cursor: pointer;
	user-select: none;

	&.is-in-state-0 {}
	&.is-in-state-1 { color: white; }
	&.is-in-state-2 {
		text-decoration-line: line-through;

		color: white;
	}
}

</style>
<!--}}}-->
