

<!-- HomeView.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.HomeView
	section.about
		include:external-links:markdown-it(html typographer) ../assets/texts/about.md

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'HomeView',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.about {
	& > p:last-of-type {
		margin-top: 10px;
	}
}

</style>
<!--}}}-->
