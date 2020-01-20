

<!-- components/ProgressBar.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ProgressBar(
	:style="{ right: `${100 - progress}%` }"
	)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get } from 'vuex-pathify'

export default {
	name: 'ProgressBar',

	data() {
		return {
			progress: 0,
		}
	},

	computed: {
		...get('progressbar', ['isLoading']),
	},

	watch: {
		isLoading: 'update',
	},

	created()
	{
		this.interval = setInterval(() => this.increment(), 200);
	},

	destroyed()
	{
		clearInterval(this.interval);
	},

	methods: {
		/**
		 * Increment the progress by a small random amount
		 * to fake a progressive loading
		 */
		increment()
		{
			const inc = Math.floor(5 + Math.random()*15);

			if (this.isLoading && this.progress < 100)
				this.progress = (this.progress + inc < 100) ? this.progress + inc : 100;
		},

		/**
		 * Reset/complete the progress
		 */
		update()
		{
			this.progress = this.isLoading ? 0 : 100;
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
	height: 4px;

	background-color: $color-cinnabar;

	transition: opacity 0.1s, right 0.5s;
}

</style>
<!--}}}-->
