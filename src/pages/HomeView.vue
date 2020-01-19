

<!-- HomeView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.HomeView
	section.about
		include:external-links:markdown-it(html typographer) ../assets/texts/about.md

	section.recent-updates
		h2.h2 Recent updates
		UpdatesViewItem(
			v-for="update in recentUpdates"
			:key="update.id"

			v-bind="update"
			)

	section.latest-licks
		h2.h2 Latest licks
		BrowseViewLick(
			v-for="lick in latestLicks"
			:key="lick.id"

			:lick="lick"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import api             from '@/modules/api'

import BrowseViewLick  from '@/components/BrowseViewLick'
import UpdatesViewItem from '@/components/UpdatesViewItem'

export default {
	name: 'HomeView',

	components: {
		BrowseViewLick,
		UpdatesViewItem,
	},

	data() {
		return {
			latestLicks:   [],
			recentUpdates: [],
		}
	},

	created()
	{
		this.$store.commit('browse/resetLickPreview');

		api.get('/licks/latest/3', _data => this.latestLicks   = _data || []);
		api.get('/updates/2',      _data => this.recentUpdates = _data || []);
	},
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
