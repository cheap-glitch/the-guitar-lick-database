

<!-- components/ProgressBar.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ProgressBar(
	ref="progressbar"

	:style="{ right: `${100 - progress}%` }"
	v-mods="{ isLoading }"
	)
	div.ProgressBar__peg(
		v-mods="{ isLoading }"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

//- import { get } from 'vuex-pathify'

const TRICKLE_MIN = 2;
const TRICKLE_MAX = 8;
const DEFAULT_PROGRESS_MAX = 90;

export default {
	name: 'ProgressBar',

	data() {
		return {
			progress:     0,
			progressMax:  DEFAULT_PROGRESS_MAX,

			isLoading:    true,
		}
	},

	mounted()
	{
		this.$refs.progressbar.addEventListener('transitionend',
			_event =>
			{
				switch (_event.propertyName)
				{
					case 'right':
						// Mask the bar when it's fully loaded
						if (this.progress == 100)
							this.isLoading   = false;
						break;

					case 'opacity':
						// Reset the bar only after it has disappeared completely
						this.progress    = 0;
						this.progressMax = DEFAULT_PROGRESS_MAX;
						break;
				}
			},
			{ passive: true }
		);

		// Increment the bar every 200 milliseconds
		this.interval = setInterval(() => this.trickle(), 200);
	},

	destroyed()
	{
		clearInterval(this.interval);
	},

	methods: {
		trickle()
		{
			if (!this.isLoading) return;

			// Increment the progress by a small random amount to fake a progressive loading
			const inc = Math.floor(TRICKLE_MIN + Math.random()*(TRICKLE_MAX - TRICKLE_MIN));
			this.progress = (this.progress + inc < this.progressMax) ? this.progress + inc : this.progressMax;

		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.ProgressBar {
	position: fixed;
	z-index: 1000;

	top: 0;
	left: $layout-aside-width + 40px;
	height: 3px;

	opacity: 0;
	background-color: $color-cinnabar;

	transition: opacity 1s, right 0.6s;

	&.is-loading {
		opacity: 1;

		transition: right 0.7s;
	}
}

.ProgressBar__peg {
	position: absolute;
	right: 0;
	bottom: 0;

	width: 200px;
	height: 20px;

	opacity: 0;
	box-shadow: 0 0 20px $color-cinnabar;

	transform: rotate(2deg) translateY(-4px);

	&.is-loading {
		opacity: 1;

		transition: right 0.7s;
	}
}

</style>
<!--}}}-->
