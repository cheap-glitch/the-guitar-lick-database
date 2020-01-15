

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

	//- Pagelist
	BrowseViewPagelist

	//----------------------------------------------------------------------
	//- List of results
	//----------------------------------------------------------------------
	section.results
		router-link.results__item(
			v-for="lick in displayedResults"
			:key="lick.id"

			:to="`/lick/${lick.id}`"
			)

			//- Infos
			p.results__item__infos
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
				| {{ data.scales[lick.scale] }}
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

			//- Preview buttons
			div.results__item__buttons
				VButton(
					v-show="previewedLick != lick.id || (previewedLick == lick.id && !isPreviewedLickReady)"

					:text="previewedLick == lick.id ? `Loading (${previewedLickProgress} %)` : 'Preview'"

					@click.native.capture.prevent.stop="previewLick(lick.id)"
					)
				VButton(
					v-show="previewedLick == lick.id && isPreviewedLickReady"

					:icon="previewedLickPlayerState == 'playing' ? 'pause' : 'play'"
					tooltip="Play/pause"

					@click.native.capture.prevent.stop="\
						previewedLickPlayerState = previewedLickPlayerState == 'playing' ? 'paused' : 'playing'"
					)
				VButton(
					v-show="previewedLick == lick.id && isPreviewedLickReady"

					icon="stop"
					tooltip="Stop"

					@click.native.capture.prevent.stop="previewedLickPlayerState = 'stopped'"
					)
				a(
					v-if="isDevMode"

					:href="`/edit/${lick.id}`"
					target="_blank"
					rel="external nofollow noopener noreferrer"

					@click.capture.stop
					) Edit the lick

			//- Tablature
			VAlphatab.results__item__lick(
				:tex="lick.tex"
				:tempo="parseInt(lick.tempo)"
				:time-signature="lick.ts"

				:is-playback-active="previewedLick == lick.id"
				:player-state="previewedLick == lick.id ? previewedLickPlayerState : 'stopped'"

				@player-loading="_progress => previewedLickProgress = _progress"
				@player-ready="isPreviewedLickReady = true, previewedLickPlayerState = 'playing'"
				@player-stopped="previewedLickPlayerState = 'stopped'"
				)

	//- Pagelist footer
	BrowseViewPagelist

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }      from 'vuex-pathify'

import data               from '@/modules/data'
import BrowseViewPagelist from '@/components/BrowseViewPagelist'

export default {
	name: 'BrowseView',

	components: {
		BrowseViewPagelist,
	},

	static() {
		return {
			data: data,
		}
	},

	data() {
		return {
			displayType:              'list',

			previewedLick:            null,
			previewedLickPlayerState: 'stopped',
			previewedLickProgress:    0,

			isPreviewedLickReady:     false,
		}
	},

	computed: {
		isDevMode()
		{
			return process.env.NODE_ENV == 'development';
		},

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

	methods:
	{
		/**
		 * Format a list of tags/genres to display
		 */
		formatList(_list, _names)
		{
			return _list.trim().split(' ').map(_v => _names[_v]).join(', ');
		},

		/**
		 * Load a lick for preview or start the playback if it's already loaded
		 */
		previewLick(_id)
		{
			if (this.previewedLick == _id) return;

			this.previewedLick         = _id;
			this.previewedLickProgress = 0;
			this.isPreviewedLickReady  = false;
		},

		//- previewLick(_id)
		//- {
		//-         if (_id in this.previewedLicks === false)
		//-         {
		//-                 // Add the lick to the list of previewed licks and trigger the loading of the soundfont
		//-                 this.$set(this.previewedLicks, _id, {
		//-                         progress:    0,
		//-                         playerState: 'paused',
		//-                 });
		//-         }
		//-         else
		//-         {
		//-                 // Start/pause the playback
		//-                 this.previewedLicks[_id].playerState = this.previewedLicks[_id].playerState == 'playing' ? 'paused' : 'playing';
		//-         }
		//- },
		//- /**
		//-  * Update the loading progress of the soundfont for a previewed lick
		//-  */
		//- updatePreviewedLickProgress(_id, _progress)
		//- {
		//-         this.previewedLicks[_id].progress = _progress;
		//- },
		//- /**
		//-  * Return the text for the preview button of a lick depending on whether the lick is previewed, loading or playing
		//-  */
		//- getPreviewButtonText(_id)
		//- {
		//-         return _id in this.previewedLicks === true
		//-                 ? this.previewedLicks[_id].progress < 100 ? `Loading… (${this.previewedLicks[_id].progress}%)` : 'Loaded!'
		//-                 : 'Preview';
		//- },
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.BrowseView {
	@include space-children-v(10px);

	// The padding is created with a border
	// to prevent long tabs from overflowing under the fade-out
	border: 20px solid $color-athens-gray;
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

	text-decoration: none;

	color: steelblue;

	cursor: pointer;

	&:active {
		color: steelblue;
	}

	&:nth-of-type(odd) {
		background-color: #e9e9e9;
	}
}

.results__item__buttons {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.results__item__lick,
.results__item__infos {
	cursor: pointer;
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang="scss">

.results__item__lick * {
	cursor: pointer !important;
}

</style>
<!--}}}-->
