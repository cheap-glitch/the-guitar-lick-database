

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

	methods: {
		update()
		{
			/*
			if (this.isLoading)
			{
			}
			else
			{
			}
			*/
		},

		reset()
		{
			this.progress = 0;
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
}

</style>
<!--}}}-->
