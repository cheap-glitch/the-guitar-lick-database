

<!-- BrowseAside.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.BrowseAside

		//--------------------------------------------------------------
		//- Artist, genre & difficulty
		//--------------------------------------------------------------
		section.section
			VFold(title="Guitarist, genre & diffculty")
				//- Artist
				VSelect(
					id="artist"
					:options="artistsNames"

					v-model="searchParams.artist"
					)
				div.row
					//- Difficulty
					VSelect(
						id="difficulty"
						:options="{ any: 'Any difficulty', ...data.difficulties }"
						v-model="searchParams.difficulty"
						)
					//- Genre
					VSelect(
						id="genre"
						:options="{ any: 'Any genre', ...data.genres }"
						v-model="searchParams.genre"
						)

		//--------------------------------------------------------------
		//- Tonality & scale
		//--------------------------------------------------------------
		section.section
			VFold(title="Tonality & scale")
				div.row
					//- Tonality
					VSelect.tonality(
						id="tonality"
						:options="{ any: 'Any', ...data.tonalities }"
						v-model="searchParams.tonality"
						)
					//- Scale
					VSelect.scale(
						id="scale"
						:options="{ any: 'Any scale', ...data.scales }"
						v-model="searchParams.scale"
						)

		//--------------------------------------------------------------
		//- Tags
		//--------------------------------------------------------------
		section.section
			VFold(title="Tags")
				div.tags
					VStatebox(
						v-for="(name, key) in data.tags"
						:key="`tag-${key}`"

						:id="`tag-${key}`"
						:value="key"
						:label="name"
						:states="['unchecked', 'included', 'excluded']"
						mode="buttons-overwrite"

						v-model="searchParams.tags"
						)
				VButton(
					text="Clear the tags"
					icon="trash-alt"

					@click="clearTags"
					)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import api      from '@/modules/api'
import data     from '@/modules/data'
import * as obj from '@/modules/object'

export default {
	name: 'BrowseAside',

	data() {
		return {
			artists: [],
			searchParams: {
				artist:      'any',
				tags:        this.$route.query.tags !== undefined ? this.getTagsFromQueryString() : {},

				// Get the search query parameters from the query string and check them against permitted values
				difficulty:  obj.checkKey(data.difficulties, this.$route.query.difficulty) || 'any',
				genre:       obj.checkKey(data.genres,       this.$route.query.genre)      || 'any',
				scale:       obj.checkKey(data.scales,       this.$route.query.scale)      || 'any',
				tonality:    obj.checkKey(data.tonalities,   this.$route.query.tonality)   || 'any',
			},
		}
	},

	computed: {
		artistsNames()
		{
			return [
				{ name: 'Any artist', value: 'any'  },
				{ name: 'No artist',  value: 'none' },
				...this.artists.map(artist => ({ name: artist.name, value: artist.url }))
			];
		},
		artistsIds()
		{
			return {
				'none': 0,
				...this.artists.reduce((acc, artist) => { acc[artist.url] = artist.id; return acc; }, {})
			};
		},
		artistsURLs()
		{
			return [
				'any',
				'none',
				...this.artists.map(artist => artist.url)
			];
		},
	},

	watch: {
		searchParams: {
			handler: function() { this.updateResults(); this.updateQueryString(); },
			deep: true,
		}
	},

	created()
	{
		this.data = data;

		// Fetch the list of all the artists
		api.get('artists',
			data => {
				this.artists = data || {};

				// Check if the query string has a parameter for the artist and if it's valid
				let artist = this.$route.query?.artist ?? 'any';
				this.searchParams.artist = this.artistsURLs.includes(artist) ? artist : 'any';

				// Fetch the latest licks and update the query string
				this.updateResults();
				this.updateQueryString();
			});
	},

	methods: {
		/**
		 * Update the query string in the current URL
		 */
		updateQueryString()
		{
			// Filter the search params to remove any wildcard values
			let queryParams = obj.objectFilter(this.searchParams, (p, v) => v !== 'any' && !(obj.isObject(v) && obj.isEmptyObject(v)));

			if (queryParams.tags)
			{
				// Format the tags for the URL query string
				queryParams.tags = obj.objectMap(
					this.searchParams.tags,
					(tag, state) => `${state == 'excluded' ? '!' : ''}${tag}`
				).join(',');
			}

			// Build the new query string
			const queryString = obj.objectMap(queryParams, (param, value) => `${param}=${value}`).join('&');

			// Update the query string
			window.history.replaceState({}, '', '/browse' + (queryString.length ? `?${queryString}` : ''))
		},

		/**
		 * Fetch all the licks according to the search parameters
		 */
		updateResults()
		{
			let searchParamsSent = {...this.searchParams};

			// Replace the artist URL by the corresponding ID
			if (searchParamsSent.artist !== 'any')
				searchParamsSent.artist = this.artistsIds[searchParamsSent.artist];

			// Fetch the licks
			api.post(
				'licks/browse',
				searchParamsSent,
				data => this.$store.commit('browse/updateResults', data),
			);
		},

		/**
		 * Get the states of the active tags from the URL query string
		 */
		getTagsFromQueryString()
		{
			return !this.$route.query.tags.length
				? {}
				: this.$route.query.tags.split(',').reduce(
					function(tags, tag)
					{
						tags[tag.replace('!', '')] = tag.startsWith('!') ? 'excluded' : 'included';

						return tags;
					}, {});
		},

		/**
		 * Disable all the tags, regardless of their state
		 */
		clearTags()
		{
			this.searchParams.tags = {};
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.BrowseAside {
	display: flex;
	flex-direction: column;
	@include space-children-v(20px);
}

.row {
	display: flex;
	@include space-children-h(10px);
}

.scale {
	flex: 3 1 auto;
}

.tonality {
	flex: 1 3 auto;
}

.tags {
	display: flex;
	flex-flow: row wrap;
}

</style>
<!--}}}-->
