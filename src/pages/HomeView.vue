

<!-- HomeView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.HomeView
	section.about(v-mods="darkMode")
		h2.h2 About
		article.about__contents.formatted-text
			include:external-links:markdown-it(html typographer) ../assets/texts/about.md

	section.recent-updates(v-mods="darkMode")
		h2.h2 Recent updates
		UpdatesViewItem(
			v-for="update in recentUpdates"
			:key="update.id"

			v-bind="update"
			)

	section.latest-licks(v-mods="darkMode")
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

import { get }         from 'vuex-pathify'

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

	computed: {
		darkMode: get('darkMode'),
	},

	created()
	{
		this.$store.commit('browse/resetLickPreview');

		api.get('/licks/latest/3', data => this.latestLicks   = data || []);
		api.get('/updates/2',      data => this.recentUpdates = data || []);
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.HomeView {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-areas: "about updates"
	                     "licks licks";
}

.about,
.latest-licks,
.recent-updates {
	padding: 20px;

	&.dark-mode {
		border-color: $color-oxford-blue;
	}
}

.about {
	grid-area: about;

	border-right: $border-section;
}

.about__contents {
	blockquote p:nth-of-type(2) {
		text-align: right;
	}

	& > p:last-of-type {
		margin-top: 10px;
	}
}

.recent-updates {
	grid-area: updates;
}

.latest-licks {
	grid-area: licks;

	border-top: $border-section;
}

</style>
<!--}}}-->
