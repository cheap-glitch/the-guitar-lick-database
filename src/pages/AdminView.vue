

<!-- AdminView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.AdminView
	h2.h2 {{ pageTitle }}

	//- Link to the page of the lick (only on /edit page)
	p(v-if="$route.name == 'edit'")
		router-link(:to="`/lick/${lick.id}`") View the lick
		| &nbsp;
		fa-icon(:icon="['far', 'external-link-square-alt']")

	//- Creation/edition form
	form.form(
		@submit.prevent="sendData"
		)

		//----------------------------------------------------------------------
		//- Tablature
		//----------------------------------------------------------------------
		label.label-v
			strong Tablature
			textarea.textarea.alphatex-editor(
				rows="4"
				cols="80"
				v-model="lick.tex"
				)

		//- Tools
		div.tablature-tools
			input(type="button" @click.left="tex = lick.tex, playerState = 'stopped'" value ="Preview")
			input(type="button" @click.left="playerState = 'playing'"                 value ="Play")
			input(type="button" @click.left="playerState = 'stopped'"                 value ="Stop")

		//- Preview
		VAlphatab.alphatab(
			:tempo="lick.tempo"
			:time-signature="lick.ts"
			:tex="tex"
			:player-state="playerState"
			:is-playback-active="true"
			score-type="mixed"

			@player-stopped="playerState = 'stopped'"
			@player-reached-end="playerState = 'stopped'"
			)

		//----------------------------------------------------------------------
		//- Musical properties
		//----------------------------------------------------------------------
		fieldset.fieldset-h
			legend.fieldset__legend Tuning, tonality & scale
			select(v-model="lick.tuning")
				option(
					v-for="(name, value) in data.tunings"
					:key="value"
					:value="value"
					) {{ name }}
			select(v-model="lick.tonality")
				option(
					v-for="(name, value) in data.tonalities"
					:key="value"
					:value="value"
					) {{ name }}
			select(v-model="lick.scale")
				option(
					v-for="(name, value) in data.scales"
					:key="value"
					:value="value"
					) {{ name }}
		fieldset.fieldset-h
			legend.fieldset__legend Tempo, time signature & triplet feel
			input(
				type="number"
				size="1"
				maxlength="3"
				v-model.number="lick.tempo"
				)
			input(
				type="text"
				size="2"
				maxlength="5"
				v-model="lick.ts"
				)
			select(v-model="lick.triplet")
				option(
					v-for="(name, value) in data.tripletFeels"
					:key="value"
					:value="value"
					) {{ name }}

		//----------------------------------------------------------------------
		//- Metadata
		//----------------------------------------------------------------------
		label.label-h
			strong Artist
			select(v-model="lick.artist")
				option(value="0") None
				option(
					v-for="artist in artists"
					:key="artist.id"
					:value="artist.id"
					) {{ artist.name }}
		label.label-h
			strong Difficulty
			select(v-model="lick.difficulty")
				option(
					v-for="(name, value) in data.difficulties"
					:key="value"
					:value="value"
					) {{ name }}
		fieldset.fieldset-v
			legend.fieldset__legend Genres
			label.label-h(
				v-for="(name, value) in data.genres"
				:key="value"
				)
				input(
					type="checkbox"
					:value="value"
					v-model="lick.genres"
					)
				span {{ name }}
		fieldset.fieldset-v
			legend.fieldset__legend Tags
			label.label-h(
				v-for="(name, value) in data.tags"
				:key="value"
				)
				input(
					type="checkbox"
					:value="value"
					v-model="lick.tags"
					)
				span {{ name }}
		label.label-h
			strong Variation of
			input(
				type="number"
				placeholder="ID of the original lick"
				v-model="lick.original"
				)
		label.label-v
			strong Notes
			textarea.textarea(
				rows="10"
				cols="60"
				v-model="lick.notes"
				)

		//- Source data
		fieldset.fieldset-v
			legend.fieldset__legend Source
			div.autosuggest__wrapper
				vue-autosuggest(
					:input-props="{ type: 'text', size: 40, placeholder: 'Existing source name' }"
					:suggestions="[{ data: source.suggestions }]"
					:get-suggestion-value="getSuggestionValue"
					:limit="5"

					v-model="source.query"
					@input="fetchSources"
					@selected="selectSource"
					)
					template(v-slot="{ suggestion }")
						span {{ suggestion.item.name }}
				p {{ `(${lick.source.sid})` }}

			fieldset.fieldset-v(
				v-show="!source.query.length"
				)
				legend.fieldset__legend Create a new source
				select(v-model="lick.source.type")
					option(
						v-for="(name, value) in data.sourceTypes"
						:for="`source-type--${value}`"
						:value="value"
						) {{ name }}
				input(
					type="text"
					placeholder="Name"
					size="40"
					v-model.trim="lick.source.name"
					)
				input(
					type="text"
					placeholder="Author"
					size="40"
					v-model.trim="lick.source.author"
					)
				input(
					type="url"
					placeholder="URL"
					size="40"
					:value="lick.source.url"
					@input="updateTimestamp($event)"
					)

			label.label-h
				span Timestamp
				input.timestamp-input(
					type="number"
					v-model.number="lick.timestamp"
					)

		//- Success/error message
		p.message(v-show="message.length") {{ message }}

		//- Submit button
		input(
			type="submit"
			:value="`${isAddPage ? 'Add the new' : 'Edit the'} lick`"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { VueAutosuggest } from 'vue-autosuggest'

import api                from '@/modules/api'
import data               from '@/modules/data'

export default {
	name: 'AdminView',

	beforeRouteEnter:  navigationGuard,
	beforeRouteUpdate: navigationGuard,

	components: {
		VueAutosuggest,
	},

	data() {
		return {
			artists:                 [],
			tex:                     '',
			playerState:             'stopped',
			message:                 '',

			lick: {
				original:        0,
				tuning:          'standard',
				tonality:        'A',
				scale:           'min5',
				tempo:           120,
				ts:              '4/4',
				triplet:         'none',
				difficulty:      'intermediate',
				artist:          0,
				genres:          [],
				tags:            [],
				tex:             '',
				notes:           '',
				source: {
					sid:     0,
					type:    'youtube',
					name:    '',
					author:  '',
					url:     '',
				},
				timestamp:       0,
			},

			source: {
				query:           '',
				timeout:         null,
				debounce:        250,
				results:         [],
				suggestions:     [],
			}
		}
	},

	computed: {
		pageTitle()
		{
			return this.isAddPage ? 'Add a new lick' : `Edit the lick #${this.$route.params.id}`;
		},
		isAddPage()
		{
			return this.$route.name === 'add';
		},
		isEditPage()
		{
			return this.$route.name === 'edit';
		},
	},

	created()
	{
		this.data = data;

		// Fetch the list of all the artists
		api.get('artists', _data => this.artists = _data || []);

		// When updating a lick, fetch its data first
		if (!this.isEditPage) return;
		api.get(`licks/read/${this.$route.params.id}`, _data =>
		{
			this.lick = _data || {};

			// Erase uneeded source data to avoid problems
			if (this.lick.source.sid != 0)
			{
				this.lick.source = {
					sid:    this.lick.source.sid,
					type:   'youtube',
					name:   '',
					author: '',
					url:    '',
				}
			}
		});
	},

	methods: {
		getSuggestionValue(_suggestion)
		{
			return _suggestion.item.name;
		},
		selectSource(_suggestion)
		{
			this.lick.source.sid = _suggestion.item.id;
		},
		fetchSources()
		{
			// Fetch suggestions only if query string is long enough
			if (this.source.query.length < 2)
			{
				this.suggestions = [];
				return;
			}

			clearTimeout(this.source.timeout);
			setTimeout(
				() => api.post(
					'sources/grep',
					{ name: this.source.query.trim() },
					_data => this.source.suggestions = _data || []
				),
				this.source.timeout
			);
		},
		updateTimestamp(_event)
		{
			let value = _event.target.value;

			// If a YouTube URL is inputted, parse it to extract the timestamp
			const match = value.match(/^(https:\/\/youtu.be\/[a-zA-z0-9_-]+)\?t=(\d+)$/);
			if (match)
			{
				this.lick.source.url = match[1];
				this.lick.timestamp  = parseInt(match[2]);
			}
		},
		sendData()
		{
			// Add a new lick
			if (this.isAddPage)
			{
				api.post(
					'licks/add',
					this.lick,
					() => this.message = 'The lick was successfully added!'
				);
				return;
			}

			// Edit a lick
			api.put(
				`licks/edit/${this.$route.params.id}`,
				this.lick,
				() => this.message = 'The lick was successfully edited!'
			);
		},
	},
}

/**
 * Redirect towards the 404 page if the lick doesn't exist
 */
function navigationGuard(_to, _from, _next)
{
	// Ignore the verification for the creation page
	if (_to.path === '/add')
	{
		_next();
		return;
	}

	// Check that the id parameter is a number
	if (!_to.params.id.toString().match(/^\d+$/))
		_next({ name: '404', params: [_to.path] });

	// Check that the lick exists
	api.get(
		`licks/exists/${_to.params.id}`,
		_data => _next(_data ? {} : { name: '404', params: [_to.path] })
	);
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

/**
 * Layout
 * -----------------------------------------------------------------------------
 */
.AdminView {
	@include space-children-v(10px);

	padding: 20px;
}

.form {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	@include space-children-v(20px);
}

.fieldset-h,
.fieldset-v {
	padding: 10px;

	border: 1px solid gray;
}

.fieldset-h {
	@include space-children-h(10px);
}

.fieldset-v {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	@include space-children-v(10px, fieldset div input select);

	align-self: stretch;
}

.autosuggest__wrapper {
	display: flex;
	align-items: baseline;
	@include space-children-h(10px);
}

/**
 * Labels
 * -----------------------------------------------------------------------------
 */
.fieldset__legend {
	font-weight: bold;
}

.label-h {
	display: block;
	@include space-children-h(10px);

	user-select: none;
}

.label-v {
	display: flex;
	flex-direction: column;
}

.message {
	font-weight: bold;
}

/**
 * Inputs
 * -----------------------------------------------------------------------------
 */
.textarea {
	padding: 5px;

	border: 1px solid gray;

	resize: none;
}

.alphatex-editor {
	font-family: monospace;
}

.timestamp-input {
	width: 100px;
}

/**
 * Others
 * -----------------------------------------------------------------------------
 */
.tablature-tools {
	display: flex;
	@include space-children-h(10px);
}

.alphatab {
	align-self: stretch;
}

</style>
<!--}}}-->

<!--{{{ vue-autosuggest styles -->
<style lang="scss">

.autosuggest__results {
	border: 2px solid darkgray;
	border-top: none;
}

.autosuggest__results-item {
	padding: 4px;

	cursor: pointer;

	&:hover {
		background-color: lightgray;
	}

	&:not(:last-child) {
		border-bottom: 1px solid gray;
	}
}

</style>
<!--}}}-->
