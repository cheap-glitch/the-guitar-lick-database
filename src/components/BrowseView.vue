

<!-- BrowseView.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.BrowseView

	//----------------------------------------------------------------------
	//- Filtering & display options
	//----------------------------------------------------------------------
	section.options

		//- Show/hide bookmarks
		VStatebox(
			id="bookmark-filter"
			value="bookmark-filter"
			label="Bookmarked"
			:states="['none', 'bookmarked', 'not-bookmarked']"
			mode="buttons-overwrite"

			v-model="bookmarkFilter"
			)

		//- Sort by
		VPillRadio(
			id="sort-by"
			label="Sort by"
			:choices="{ 'added date': 'date', 'difficulty': 'difficulty' }"

			v-model="sortBy"
			)

		//- Sort order
		VPillRadio(
			id="sort-order"
			label="Sort order"
			:choices="{ 'ascending': 'ascending', 'descending': 'descending' }"

			v-model="sortOrder"
			)

		//- Set number of results per page
		VPillRadio(
			id="nbResultsPerPage"
			label="licks per page"
			label-position="right"
			:choices="{ '5': 5, '10': 10, '15': 15, '20': 20 }"

			v-model.number="nbResultsPerPage"
			)

	//----------------------------------------------------------------------
	//- List of results
	//----------------------------------------------------------------------
	BrowseViewPagelist

	section.results
		router-link.results__item(
			v-for="lick in displayedResults"
			:key="lick.id"

			:to="`/lick/${lick.id}`"
			)

			//- Infos
			p
				//- ID
				| \#{{ lick.id }}
				|

				//- Artist
				span(v-if="lick.artistName")
					fa-icon(:icon="['far', 'user-circle']")
					|
					| {{ lick.artistName }}
					|

				//- Tonality & scale
				fa-icon(:icon="['far', 'music']")
				|
				| {{ data.tonalities[lick.tonality] }}
				|
				| {{ data.scalesLicks[lick.scale] }}
				|

				//- Genres
				fa-icon(:icon="['far', 'compact-disc']")
				|
				| {{ formatList(lick.genres, data.genres) }}
				|

				//- Difficulty
				fa-icon(:icon="['far', 'mountain']")
				|
				| {{ data.difficulties[lick.difficulty] }}
				|

				//- Tags
				fa-icon(:icon="['far', 'tags']")
				|
				| {{ formatList(lick.tags, data.tags) }}

			//- Preview button
			VButton(
				icon="play"
				tooltip="Listen to the lick"

				@click.prevent="previewLick(lick.id)"
				)

			//- Tablature
			VAlphatab.results__item__lick(
				:tex="lick.tab"
				:tempo="parseInt(lick.tempo)"
				:time-signature="lick.ts"

				:is-playback-active="previewedLicks.includes(lick.id)"
				)

	BrowseViewPagelist

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapGetters } from 'vuex';

import Data		  from '@/modules/data';
import BrowseViewPagelist from '@/components/BrowseViewPagelist';

export default {
	name: 'BrowseView',

	components: {
		BrowseViewPagelist,
	},

	static() {
		return {
			data: Data,
		}
	},

	data() {
		return {
			displayType:    'list',
			previewedLicks: [],
		}
	},

	computed: {
		bookmarkFilter:
		{
			get()	{ return this.$store.state.browse.bookmarkFilter;	},
			set(_v) { this.$store.commit('browse/setBookmarkFilter', _v);	},
		},
		sortBy:
		{
			get()	{ return this.$store.state.browse.sortBy;		},
			set(_v) { this.$store.commit('browse/setSortBy', _v);		},
		},
		sortOrder:
		{
			get()	{ return this.$store.state.browse.sortOrder;		},
			set(_v) { this.$store.commit('browse/setSortOrder', _v);	},
		},
		nbResultsPerPage:
		{
			get()	{ return this.$store.state.browse.nbResultsPerPage;	},
			set(_v) { this.$store.commit('browse/setNbResultsPerPage', _v); },
		},

		...mapGetters('browse', [
			'displayedResults',
		])
	},

	methods:
	{
		/**
		 * Mark a lick as being ready for preview
		 */
		previewLick(_id)
		{
			if (!this.previewedLicks.includes(_id))
				this.previewedLicks.push(_id);
		},

		/**
		 * Format a list of tags/genres to display
		 */
		formatList(_list, _names)
		{
			return _list.trim().split(' ').map(_v => _names[_v]).join(', ');
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.BrowseView {
	@include space-children-v(10px);

	// The padding is created with a border
	// to prevent long tabs from overflowing under the fade-out
	border: 20px solid white;
}

.options {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.results {
	min-height: 1200px;
}

.results__item {
	display: block;

	position: relative;
	height: 230px;

	text-decoration: none;

	cursor: pointer;

	&:nth-of-type(odd) {
		background-color: gold;
	}
}

.results__item__lick {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
}

</style>
<!--}}}-->
