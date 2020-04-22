

<!-- BrowseView.vue -->


<!--{{{ Pug -->
<template lang="pug">

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
			is-on-light-bg

			v-model="bookmarkFilter"
			)

		//- Sort by
		VPillRadio(
			id="sort-by"
			label="Sort by"
			:choices="{ 'date added': 'date', 'difficulty': 'difficulty' }"

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
		BrowseViewLick.results__item(
			v-for="lick in displayedResults"
			:key="lick.id"
			:lick="lick"
			)

	BrowseViewPagelist

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }      from 'vuex-pathify'

import BrowseViewLick     from '@/components/BrowseViewLick'
import BrowseViewPagelist from '@/components/BrowseViewPagelist'

export default {
	name: 'BrowseView',

	components: {
		BrowseViewLick,
		BrowseViewPagelist,
	},

	data() {
		return {
			displayType: 'list',
		}
	},

	computed: {
		...get('browse', [
			'displayedResults',
		]),

		...sync('browse', [
			'bookmarkFilter',
			'sortBy',
			'sortOrder',
			'nbResultsPerPage',
		]),
	},

	created()
	{
		this.$store.commit('browse/resetLickPreview');
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.BrowseView {
	@include space-children-v(20px);

	/**
	 * The padding is created with a border
	 * to prevent long tabs from overflowing under the fade-out
	 */
	border: 20px solid var(--color--bg);

	transition: border-color 0.2s;
}

.options {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.results {
	@include space-children-v(10px);

	min-height: 1200px;
}

.results__item:nth-of-type(odd) {
	background-color: var(--color--bg--hover);
}

</style>
<!--}}}-->
