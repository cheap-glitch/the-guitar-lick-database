

<!-- LickView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.LickView

	//----------------------------------------------------------------------
	//- Score
	//----------------------------------------------------------------------
	section.wrapper-lick(v-if="lick")
		div.wrapper-lick__header
			h2 Lick \#{{ id }}

			//- Bookmarking button
			VButton(
				:icon="[isBookmarked ? 'fas' : 'far', 'star']"
				:is-active="isBookmarked"
				:tooltip="`${isBookmarked ? 'Remove from' : 'Add to'} the bookmarks`"

				@click="toggleBookmarked"
				)

		//- Link to edition page (only in dev mode)
		p(v-if="devMode")
			router-link(:to="`/edit/${id}`") Edit the lick
			| &nbsp;
			fa-icon(:icon="['far', 'external-link-square-alt']")

		//- Loading message
		div.loading-bar(v-show="!isLickLoaded")
			p Loading the soundfont… ({{ loadingProgress }}%)

		//- Score
		VAlphatab(
			layout="page"
			:tex="lickTexTransposed"
			:is-tex-expanded="true"
			:tempo="isSpeedTrainerOn ? stCurrentTempo : tempo"
			:time-signature="lick.ts"

			:score-type="scoreType"
			:zoom="zoom"
			:is-picking-shown="isPickingShown"

			:player-state="playerState"
			:vol-playback="volPlayback"
			:vol-metronome="volMetronome"
			:is-playback-active="true"
			:is-looping-on="isLoopingOn || isSpeedTrainerOn"
			:is-metronome-on="isMetronomeOn"
			:is-countdown-on="isCountdownOn"

			@player-loading="updateLoadingProgress"
			@player-ready="$store.commit('player/setLickLoaded', true)"
			@player-reached-end="$store.commit('player/incrementNbLoops')"
			@player-stopped="$store.commit('player/setPlayerState', 'stopped')"
			)

		//- alphaTab credit
		p.credit: :external-links:markdown-it(inline) Scores & tablatures rendered using the awesome [alphTab->](https:\/\/www.alphatab.net)

	//----------------------------------------------------------------------
	//- Infos & notes
	//----------------------------------------------------------------------
	section.wrapper-infos(v-if="lick")
		h3 Informations

		//- Artist
		p.wrapper-infos__item(v-if="lick.artist !== '0'")
			fa-icon(:icon="['far', 'user-circle']")
			router-link(
				:to="`/browse?artist=${lick.artistURL}`"
				) {{ lick.artistName }}
		//- Genres
		p.wrapper-infos__item
			fa-icon(:icon="['far', 'compact-disc']")
			span
				span(
					v-for="(genre, index) in lick.genres"
					:key="genre"
					)
					router-link(
						:to="`/browse?genre=${genre}`"
						) {{ data.genres[genre] }}
					span(v-if="index < lick.genres.length - 1")
						| ,
						|
		//- Difficulty
		p.wrapper-infos__item
			fa-icon(:icon="['far', 'mountain']")
			router-link(
				:to="`/browse?difficulty=${lick.difficulty}`"
				) {{ data.difficulties[lick.difficulty] }}
		//- Scale & tonality
		p.wrapper-infos__item
			fa-icon(:icon="['far', 'music']")
			router-link(
				:to="`/browse?tonality=${lick.tonality}&scale=${lick.scale}`"
				) {{ data.tonalities[lick.tonality] + ' ' + data.scales[lick.scale] }}
		//- Tuning
		p.wrapper-infos__item
			fa-icon(:icon="['far', 'guitar-electric']")
			router-link(
				:to="`/browse?tuning=${lick.tuning}`"
				) {{ data.tunings[lick.tuning] }}
		//- Tags
		p.wrapper-infos__item
			fa-icon(:icon="['far', 'tags']")
			span
				span(
					v-for="(tag, index) in lick.tags"
					:key="tag"
					)
					router-link(
						:to="`/browse?tags=${tag}`"
						) {{ data.tags[tag] }}
					span(v-if="index < lick.tags.length - 1")
						| ,
						|

		//- Source
		p.wrapper-infos__item.source-info(v-if="lick.source.type")
			span
				| Source:
				|
				fa-icon(:icon="lickSourceIcon")
				| &nbsp;
				span(v-if="lick.source.url.length")
					a(
						:href="lickSourceURL"
						target="_blank"
						rel="external nofollow noopener noreferrer"
						) {{ lickSourceText }}
					| &nbsp;
					fa-icon(:icon="['far', 'external-link-square-alt']")
				span(v-else) {{ lickSourceText }}

		//- Notes
		div(v-if="parsedNotes.length")
			h3 Notes
			p.formatted-text(v-html="parsedNotes")

	//----------------------------------------------------------------------
	//- Variations & suggestions
	//----------------------------------------------------------------------
	section.wrapper-suggestions

		//- Original lick
		div.original(v-if="lick && lick.originalId")
			h3 Original lick
			router-link(
				:to="`/lick/${lick.originalId}`"
				)
				p \#{{ lick.originalId }}
				VAlphatab(
					:tex="lick.originalTex"
					:tempo="parseInt(lick.originalTempo)"
					:time-signature="lick.originalTs"
					:zoom="7"
					)
		//- Variations
		div.variations(v-if="variations.length")
			h3 Variations
			router-link(
				v-for="lick in variations"
				:key="`variation--${lick.id}`"
				:to="`/lick/${lick.id}`"
				)
				p \#{{ lick.id }}
				VAlphatab(
					:tex="lick.tex"
					:tempo="parseInt(lick.tempo)"
					:time-signature="lick.ts"
					:zoom="7"
					)
		//- Suggestions
		div.suggestions(v-if="suggestions.length")
			h3 Suggestions
			router-link(
				v-for="lick in suggestions"
				:key="`suggestion--${lick.id}`"
				:to="`/lick/${lick.id}`"
				)
				p \#{{ lick.id }}
				VAlphatab(
					:tex="lick.tex"
					:tempo="parseInt(lick.tempo)"
					:time-signature="lick.ts"
					:zoom="7"
					)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                from 'vuex-pathify'
import MarkdownIt             from 'markdown-it'

import api                    from '@/modules/api'
import data                   from '@/modules/data'
import { prettifyTypography } from '@/modules/filters'

export default {
	name: 'LickView',

	beforeRouteEnter:  navigationGuard,
	beforeRouteUpdate: navigationGuard,

	props: {
		id: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			suggestions:     [],
			isBookmarked:    this.$store.getters['bookmarks/isBookmarked'](this.$route.params.id),
			loadingProgress: 0,
		}
	},

	computed: {
		lickSourceText()
		{
			// Concatenate the name and the author
			return `${this.lick.source.name} (${this.lick.source.author})`;
		},
		lickSourceURL()
		{
			// Add an potential timestamp at the end of YouTube links
			return (this.lick.source.type === 'youtube')
				? this.lick.source.url + (this.lick.source.timestamp > 0 ? `?t=${this.lick.source.timestamp}` : '')
				: this.lick.source.url;
		},
		lickSourceIcon()
		{
			return [
				this.lick.source.type === 'youtube' ? 'fab' : 'far',
				{
					collection: 'file-music',
					song:       'album',
					textbook:   'book',
					youtube:    'youtube',
					article:    'file-alt',
				}[this.lick.source.type]
			];
		},
		parsedNotes()
		{
			return prettifyTypography(this.markdown.render(this.lick.notes.trim().replace(/\r/g, ''))
				// Remove the surrounding <p> tags
				.replace(/<\/?p>/g, '')
				// Insert links to other licks
				.replace(/{{(\d+)}}/g, '<a href="/lick/$1">#$1</a>')
			);
		},
		variations()
		{
			return this?.lick?.variations ?? [];
		},
		devMode()
		{
			return process.env.NODE_ENV === 'development';
		},

		...get('player', [
			'lick',
			'lickTexTransposed',

			'scoreType',
			'zoom',

			'playerState',
			'tempo',
			'volPlayback',
			'volMetronome',

			'isCountdownOn',
			'isLickLoaded',
			'isLoopingOn',
			'isMetronomeOn',
			'isPickingShown',
			'isSpeedTrainerOn',

			'stCurrentTempo',
		]),
	},

	watch: {
		'$route': 'loadLick',
	},

	created()
	{
		this.data     = data;
		this.markdown = new MarkdownIt({
			breaks:      true,
			typographer: true,
		});

		this.$store.commit('player/resetNbLoops');
		this.loadLick();
	},

	methods: {
		/**
		 * Update the loading percentage of the soundfont
		 */
		updateLoadingProgress(percent)
		{
			this.loadingProgress = percent;
		},

		/**
		 * Fetch & update the data
		 */
		loadLick()
		{
			// Fetch the lick
			api.get(
				`licks/read/${this.id}`,
				data => {
					this.$store.commit('player/setLick',         data        || null);
					this.$store.commit('player/setTempo',        data?.tempo ?? 120);
					this.$store.commit('player/setDefaultTempo', data?.tempo ?? 120);

					// Fetch some suggestions
					api.post('licks/suggest', this.lick, data => this.suggestions = data || []);
				});
		},

		/**
		 * Add/remove the lick to the bookmarks
		 */
		toggleBookmarked()
		{
			this.isBookmarked = !this.isBookmarked;
			this.$store.commit(`bookmarks/${this.isBookmarked ? 'insertBookmark' : 'removeBookmark'}`, this.id);
		},
	}
}

/**
 * Redirect towards the 404 page if the lick doesn't exist
 */
function navigationGuard(to, from, next)
{
	// Check that the id parameter is a number
	if (!to.params.id.toString().match(/^\d+$/))
		next({ name: '404', params: [to.path] });

	// Check that the lick exists
	api.get(
		`licks/exists/${to.params.id}`,
		data => next(data ? {} : { name: '404', params: [to.path] })
	);
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@mixin fade-out-overflow()
{
	position: relative;

	&::after {
		content: '';

		position: absolute;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;

		width: 40px;

		background-image: linear-gradient(to left, var(--color--bg) 50%, transparent);
	}
}

.LickView {
	display: grid;
	grid-template-rows: max-content auto;
	grid-template-columns: 50% 50%;
	grid-template-areas:
		"wrapper-lick  wrapper-lick"
		"wrapper-infos wrapper-suggestions";
}

.wrapper-lick,
.wrapper-infos,
.wrapper-suggestions {
	padding: 20px;
}

.wrapper-lick {
	grid-area: wrapper-lick;
	min-height: 400px;
}

.wrapper-lick__header {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.wrapper-infos {
	grid-area: wrapper-infos;
}

.wrapper-suggestions {
	grid-area: wrapper-suggestions;

	@include fade-out-overflow;
}

.wrapper-infos,
.wrapper-suggestions {
	border-top: 3px dotted var(--color--border);
}

.wrapper-infos {
	border-right: 3px dotted var(--color--border);
}

.wrapper-infos__item {
	@include space-children-h(10px);

	line-height: 1.6;
}

.source-info {
	margin-top: 10px;
}

.credit {
	text-align: right;

	font-size: 0.8em;
	font-style: italic;

	color: lightgray;

	a { color: lightgray; }
}

.external-link-icon {
	margin-left: 5px;
}

</style>
<!--}}}-->
