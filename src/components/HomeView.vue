

<!-- HomeView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.HomeView
	section.about
		include:external-links:markdown-it(html typographer) ../assets/texts/about.md

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import api from '@/modules/api'

export default {
	name: 'HomeView',

	data() {
		return {
			latestLicks: [],
		}
	},

	created()
	{
		api.get('/licks/latest/5', _data => this.latestLicks = _data);
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.about {
	& > p:last-of-type {
		margin-top: 10px;
	}
}

</style>
<!--}}}-->
