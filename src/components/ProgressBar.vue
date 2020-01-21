

<!-- components/ProgressBar.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ProgressBar(
	ref="progressbar"

	:style="{ right: `${100 - progress}%` }"
	v-mods="{ isLoading: progress < 100 }"
	)
	div.ProgressBar__peg(v-mods="{ isLoading: progress < 100 }")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync } from 'vuex-pathify'

const TRICKLE_MIN = 1;
const TRICKLE_MAX = 3;

export default {
	name: 'ProgressBar',

	computed: {
		...sync({
			progress:    'progressBar',
		}),
		...get({
			progressMax: 'progressBarMax',
		}),
	},

	created()
	{
		// Increment the bar every 20 milliseconds
		this.interval = setInterval(() => this.trickle(), 5);
	},

	destroyed()
	{
		clearInterval(this.interval);
	},

	methods: {
		trickle()
		{
			if (this.progress >= 100)
				return;

			// Mask the bar when it's fully loaded
			if (this.progress == 100)
				this.isLoading = false;

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
	height: 2px;

	opacity: 0;
	background-color: $color-cinnabar;

	transition: opacity 0.8s;

	&.is-loading {
		opacity: 1;
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

	transition: opacity 0.8s;

	&.is-loading {
		opacity: 1;
	}
}

</style>
<!--}}}-->
