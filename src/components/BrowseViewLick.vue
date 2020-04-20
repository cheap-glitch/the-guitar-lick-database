

<!-- components/BrowseViewLick.vue -->


<!--{{{ Pug -->
<template lang="pug">

router-link.BrowseViewLick(:to="`/lick/${lick.id}`")

	//----------------------------------------------------------------------
	//- Infos
	//----------------------------------------------------------------------
	p.BrowseViewLick__infos
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

	//----------------------------------------------------------------------
	//- Preview buttons
	//----------------------------------------------------------------------
	div.BrowseViewLick__buttons
		VButton(
			v-show="previewedLick != lick.id || (previewedLick == lick.id && !isPreviewedLickReady)"

			icon="play"
			:text="previewedLick == lick.id ? `Loading (${previewedLickProgress} %)` : 'Preview'"
			is-on-light-bg

			@click.native.capture.prevent.stop="previewLick(lick.id)"
			)

		VButton(
			v-show="previewedLick == lick.id && isPreviewedLickReady"

			:icon="previewedLickPlayerState == 'playing' ? 'pause' : 'play'"
			tooltip="Play/pause"
			is-on-light-bg

			@click.native.capture.prevent.stop="previewedLickPlayerState = previewedLickPlayerState == 'playing' ? 'paused' : 'playing'"
			)

		VButton(
			v-show="previewedLick == lick.id && isPreviewedLickReady"

			icon="stop"
			tooltip="Stop"
			is-on-light-bg

			@click.native.capture.prevent.stop="previewedLickPlayerState = 'stopped'"
			)

		p: a(
			v-if="isDevMode"

			:href="`/edit/${lick.id}`"
			target="_blank"
			rel="external nofollow noopener noreferrer"

			@click.capture.stop
			) Edit the lick

	//----------------------------------------------------------------------
	//- Tablature
	//----------------------------------------------------------------------
	VAlphatab.BrowseViewLick__score(
		:tex="lick.tex"
		:tempo="parseInt(lick.tempo)"
		:time-signature="lick.ts"

		:is-playback-active="previewedLick == lick.id"
		:player-state="previewedLick == lick.id ? previewedLickPlayerState : 'stopped'"

		@player-loading="progress => previewedLickProgress = progress"
		@player-ready="isPreviewedLickReady = true, previewedLickPlayerState = 'playing'"
		@player-stopped="previewedLickPlayerState = 'stopped'"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import data     from '@/modules/data'

import { sync } from 'vuex-pathify'

export default {
	name: 'BrowseViewLick',

	props: {
		lick: {
			type: Object,
			required: true,
		},
	},

	computed: {
		isDevMode()
		{
			return process.env.NODE_ENV == 'development';
		},

		...sync('browse', [
			'isPreviewedLickReady',
			'previewedLick',
			'previewedLickProgress',
			'previewedLickPlayerState',
		]),
	},

	created()
	{
		this.data = data;
	},

	methods:
	{
		/**
		 * Format a list of tags/genres to display
		 */
		formatList(list, names)
		{
			return list.trim().split(' ').map(v => names[v]).join(', ');
		},

		/**
		 * Load a lick for preview or start the playback if it's already loaded
		 */
		previewLick(id)
		{
			if (this.previewedLick == id) return;

			this.previewedLick         = id;
			this.previewedLickProgress = 0;
			this.isPreviewedLickReady  = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.BrowseViewLick {
	display: block;

	min-height: 300px;

	text-decoration: none;

	color: steelblue;

	cursor: pointer;

	&:active {
		color: steelblue;
	}
}

.BrowseViewLick__buttons {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.BrowseViewLick__score,
.BrowseViewLick__infos {
	cursor: pointer;
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang="scss">

.BrowseViewLick__score * {
	cursor: pointer !important;
}

</style>
<!--}}}-->
