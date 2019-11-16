

<!-- BrowseAside.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.BrowseAside

		//--------------------------------------------------------------
		//- Artist, genre & difficulty
		//--------------------------------------------------------------
		section.section

			h2.section__header(@click.left="isSectionArtistOpened = !isSectionArtistOpened")
				p Guitarist, genre & diffculty
				fa-icon.section__header__chevron(
					:icon="['far', 'chevron-down']"
					:class="{ 'is-flipped': !isSectionArtistOpened }"
					)

			transition(name="fade")
				div.section__content(v-show="isSectionArtistOpened")
					div.row
						//- Artist
						VSelect(
							id="artist"
							:options="artistsNames"

							v-model="searchParams.artist"
							)
						//- Genre
						VSelect(
							id="genre"
							:options="{ any: 'Any genre', ...data.genres }"
							v-model="searchParams.genre"
							)

					//- Difficulty
					VSelect(
						id="difficulty"
						:options="{ any: 'Any difficulty', ...data.difficulties }"
						v-model="searchParams.difficulty"
						)

		//--------------------------------------------------------------
		//- Tonality & scale
		//--------------------------------------------------------------
		section.section

			h2.section__header(@click.left="isSectionMusicOpened = !isSectionMusicOpened")
				p Tonality & scale
				fa-icon.section__header__chevron(
					:icon="['far', 'chevron-down']"
					:class="{ 'is-flipped': !isSectionMusicOpened }"
					)

			transition(name="fade")
				div.section__content(v-show="isSectionMusicOpened")
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
							:options="{ any: 'Any scale', ...data.scalesLicks }"
							v-model="searchParams.scale"
							)

		//--------------------------------------------------------------
		//- Tags
		//--------------------------------------------------------------
		section.section

			h2.section__header(@click.left="isSectionTagsOpened = !isSectionTagsOpened")
				p Tags
				fa-icon.section__header__chevron(
					:icon="['far', 'chevron-down']"
					:class="{ 'is-flipped': !isSectionTagsOpened }"
					)

			//- Tags
			transition(name="fade")
				div.section__content(v-show="isSectionTagsOpened")
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

import api  from '@/modules/api';
import Obj  from '@/modules/object';
import Data from '@/modules/data';

export default {
	name: 'BrowseAside',

	static() {
		return {
			data: Data,
		}
	},

	data() {
		return {
			artists: [],
			searchParams: {
				artist:		'any',
				tags:		this.$route.query.tags !== undefined ? this.getTagsFromQueryString() : {},

				// Get the search query parameters from the query string and check them against permitted values
				difficulty:	Obj.check(this.$route.query, 'difficulty', this.data.difficulties, 'any'),
				genre:		Obj.check(this.$route.query, 'genre',	   this.data.genres,	   'any'),
				scale:		Obj.check(this.$route.query, 'scale',	   this.data.scales,	   'any'),
				tonality:	Obj.check(this.$route.query, 'tonality',   this.data.tonalities,   'any'),
			},
			isSectionArtistOpened: true,
			isSectionMusicOpened:  true,
			isSectionTagsOpened:   true,
		}
	},

	computed: {
		artistsNames()
		{
			return {
				'any':  'Any artist',
				'none': 'No artist',
				...this.artists.reduce((_acc, _artist) => { _acc[_artist.url] = _artist.name; return _acc; }, {})
			};
		},
		artistsIds()
		{
			return {
				'none': 0,
				...this.artists.reduce((_acc, _artist) => { _acc[_artist.url] = _artist.id; return _acc; }, {})
			};
		},
		artistsURLs()
		{
			return [
				'any',
				'none',
				...this.artists.map(_artist => _artist.url)
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
		// Fetch the list of all the artists
		api.get('artists',
			_response => {
				this.artists = _response?.data ?? {};

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
			let queryParams = Obj.filter(this.searchParams, (_p, _v) => _v !== 'any' && !(Obj.isObject(_v) && Obj.isEmpty(_v)));

			// Format the tags for the URL query string
			if (queryParams.tags)
			{
				queryParams.tags = Obj.map(
					this.searchParams.tags,
					(_tag, _state) => `${_state == 'excluded' ? '!' : ''}${_tag}`
				).join(',');
			}

			// Update the query string
			this.$router.replace({ query: queryParams }).catch(_error => console.log(_error.message));
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
				'lick/browse',
				searchParamsSent,
				_response => this.$store.commit('browse/updateResults', _response.data),
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
					function(_tags, _tag)
					{
						_tags[_tag.replace('!', '')] = _tag.startsWith('!') ? 'excluded' : 'included';

						return _tags;
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
<style lang='scss' scoped>

@import '@/styles/transitions';

.BrowseAside {
	display: flex;
	flex-direction: column;
	@include space-children-v(20px);

	width: 300px;
}

.section__header {
	display: flex;
	justify-content: space-between;

	margin-bottom: 15px;
	padding-bottom: 10px;

	font-weight: bold;

	border-bottom: 1px solid $color-oxford-blue;

	color: $color-nepal;

	cursor: pointer;
	user-select: none;
}

.section__header__chevron {
	@include flip();
}

.section__content {
	@include space-children-v(10px);
}

.row {
	display: flex;
	@include space-children-h(10px);
}

.scale	  { flex: 3 1 auto; }
.tonality { flex: 1 3 auto; }

.tags {
	display: flex;
	flex-flow: row wrap;
}

</style>
<!--}}}-->
