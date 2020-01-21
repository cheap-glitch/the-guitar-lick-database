

<!-- components/ProgressBar.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ProgressBar(
	:style="{ right: `${100 - progress}%` }"
	v-mods="{ isDisplayed: progress < 90 }"
	)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

//- import { get } from 'vuex-pathify'

const MIN_TRICKLE       =  2;
const MAX_TRICKLE       =  8;
const MAX_FAKE_PROGRESS = 90;

export default {
	name: 'ProgressBar',

	data() {
		return {
			progress: 0,
		}
	},

	created()
	{
		this.interval = setInterval(() => this.trickle(), 200);
	},

	destroyed()
	{
		clearInterval(this.interval);
	},

	methods: {
		/**
		 * Increment the progress by a small random amount to fake a progressive loading
		 */
		trickle()
		{
			const inc = Math.floor(MIN_TRICKLE + Math.random()*(MAX_TRICKLE - MIN_TRICKLE));

			if (this.progress < MAX_FAKE_PROGRESS)
				this.progress = (this.progress + inc < MAX_FAKE_PROGRESS) ? this.progress + inc : MAX_FAKE_PROGRESS;
		},

		/**
		 * Reset/complete the progress
		 */
		//- update()
		//- {
		//-         this.progress = this.isLoading ? 0 : 100;
		//- },
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
	height: 4px;

	opacity: 0;
	background-color: $color-cinnabar;

	transition: right 0.7s;

	&.is-displayed {
		opacity: 1;

		transition: opacity 0.2s, right 0.7s;
	}
}

</style>
<!--}}}-->
