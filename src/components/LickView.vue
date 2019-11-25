

<!-- LickView.vue -->


<!--{{{ Pug -->
<template lang='pug'>

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

		//- Loading bar
		div.loading-bar(v-show="!isLickLoaded")
			p Loading the soundfont… ({{ loadingProgress }}%)

		//- Score
		VAlphatab(
			layout="page"
			:tex="lickTexTransposed"
			:is-tex-expanded="true"
			:tempo="tempo"
			:time-signature="lick.ts"

			:score-type="scoreType"
			:zoom="zoomLevel"
			:is-picking-shown="isPickingShown"

			:player-state="playerState"
			:vol-playback="volPlayback"
			:vol-metronome="volMetronome"
			:is-playback-active="true"
			:is-looping-on="isLoopingOn"
			:is-metronome-on="isMetronomeOn"
			:is-countdown-on="isCountdownOn"

			@player-loading="updateLoadingProgress"
			@player-ready="$store.commit('player/setLickLoaded', true)"
			@player-stopped="$store.commit('player/setPlayerState', 'stopped')"
			)

		//- alphaTab credit
		p.credit: :external-links:markdown-it(inline) Score & tablature rendered using the awesome [alphTab->](https:\/\/www.alphatab.net)

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
		p.wrapper-infos__item(v-if="lick.source.type")
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
				p(v-else) {{ lickSourceText }}

		//- Link to edition page (only in dev mode)
		p(v-if="devMode")
			router-link(:to="`/edit/${id}`") Edit the lick
			| &nbsp;
			fa-icon(:icon="['far', 'external-link-square-alt']")

		//- Notes
		div(v-if="parsedNotes.length")
			h3 Notes
			p.notes(v-html="parsedNotes")

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
					:tex="lick.originalTab"
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
					:tex="lick.tab"
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
					:tex="lick.tab"
					:tempo="parseInt(lick.tempo)"
					:time-signature="lick.ts"
					:zoom="7"
					)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import MarkdownIt		from 'markdown-it';
import { mapState, mapGetters } from 'vuex';

import api  from '@/modules/api';
import data from '@/modules/data';

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

	static() {
		return {
			data: data,
			md: new MarkdownIt({
				breaks:      true,
				typographer: true,
			}),
		}
	},

	data() {
		return {
			suggestions:	 [],
			isBookmarked:	 this.$store.getters['bookmarks/isBookmarked'](this.$route.params.id),
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
					song:	    'album',
					textbook:   'book',
					youtube:    'youtube',
					article:    'file-alt',
				}[this.lick.source.type]
			];
		},
		parsedNotes()
		{
			return this.md.render(this.lick.notes.trim().replace(/\r/g, ''))

				// Remove the surrounding <p> tags
				.replace(/<\/?p>/g, '')

				// Prettify the note names
				.replace(/([A-G])b\b/g, '$1♭')
				.replace(/([A-G])#/g,   '$1♯')

				// Correct the typography
				.replace(/ (:|\?|!)/g, '$1')

				// Insert link to other licks
				.replace(/{{(\d+)}}/g, '<a href="/lick/$1">#$1</a>');
		},
		variations()
		{
			return this?.lick?.variations ?? [];
		},
		devMode()
		{
			return process.env.NODE_ENV === 'development';
		},

		...mapState('player', [
			'lick',
			'isLickLoaded',

			'scoreType',
			'zoomLevel',
			'isPickingShown',

			'playerState',
			'tempo',
			'volPlayback',
			'volMetronome',
			'isLoopingOn',
			'isMetronomeOn',
			'isCountdownOn',
		]),

		...mapGetters('player', [
			'lickTexTransposed',
		]),
	},

	watch: {
		'$route': 'updateLick',
	},

	created()
	{
		this.updateLick();
	},

	methods: {
		/**
		 * Update the loading percentage of the soundfont
		 */
		updateLoadingProgress(_percent)
		{
			this.loadingProgress = _percent;
		},

		/**
		 * Fetch & update the data
		 */
		updateLick()
		{
			// Fetch the lick
			api.get(
				`lick/read/${this.id}`,
				_data => {
					this.$store.commit('player/setLick',  _data	   || null);
					this.$store.commit('player/setTempo', _data?.tempo ?? 120);

					// Fetch some suggestions
					api.post('lick/suggest', this.lick, __data => this.suggestions = __data || []);
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
function navigationGuard(_to, _from, _next)
{
	api.get(
		`lick/exists/${_to.params.id}`,
		_data => _next(_data ? {} : { name: '404', params: [ _to.path ] })
	);
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

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
	border-top: 3px dotted lightgray;
}

.wrapper-infos {
	border-right: 3px dotted lightgray;
}

.wrapper-infos__item {
	@include space-children-h(10px);
}

.notes {
	line-height: 1.4;

	text-align: justify;
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
