

<!-- HomeView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.HomeView
	section.about
		h2 About
		article.about__contents.formatted-text
			include:external-links:markdown-it(html typographer) ../assets/about.md

	section.recent-updates
		h2 Recent updates
		each post in updatePosts
			article
				h3= post.date
				div.formatted-text !{post.contents}

	section.latest-licks
		h2 Latest licks
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

export default {
	name: 'HomeView',

	components: {
		BrowseViewLick,
	},

	data() {
		return {
			latestLicks: [],
		}
	},

	created()
	{
		this.$store.commit('browse/resetLickPreview');

		api.get('/licks/latest/3', data => this.latestLicks = data || []);
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

	border-color: var(--color--border);
}

.about {
	grid-area: about;

	border-right: 3px dotted var(--color--border);
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

	border-top: 3px dotted var(--color--border);
}

</style>
<!--}}}-->
