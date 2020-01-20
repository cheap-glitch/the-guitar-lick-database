

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

export default {
	name: 'ProgressBar',

	data() {
		return {
			progress: 100,
		}
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
