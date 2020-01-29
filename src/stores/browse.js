
/**
 * stores/browse.js
 */

import data    from '@/modules/data'
import storage from '@/modules/storage'

export default
{
	namespaced: true,

	state: {
		results:                   [],

		bookmarkFilter:            'none',
		sortBy:                    storage.get('browse/sortBy',    'date',       v => ['date',      'difficulty'].includes(v)),
		sortOrder:                 storage.get('browse/sortOrder', 'descending', v => ['ascending', 'descending'].includes(v)),

		currentPage:               1,
		nbResultsPerPage:          storage.get('browse/nbResultsPerPage', 5, v => [5, 10, 15, 20].includes(v)),

		isPreviewedLickReady:      false,
		previewedLick:             null,
		previewedLickPlayerState:  'stopped',
		previewedLickProgress:     0,
	},

	getters: {
		nbPages(state, getters)
		{
			return Math.ceil(getters.filteredResults.length / state.nbResultsPerPage);
		},

		displayedResults(state, getters)
		{
			// Keep only the licks on the current page
			return getters.sortedResults.slice(
				(state.currentPage - 1)*state.nbResultsPerPage,
				state.currentPage*state.nbResultsPerPage
			);
		},

		sortedResults(state, getters)
		{
			let difficulties  = Object.keys(data.difficulties);
			let sortedResults = [...getters.filteredResults];

			// The results are sorted by added date by default
			if (state.sortBy !== 'date')
				sortedResults.sort((a, b) => {
					switch (state.sortBy)
					{
						case 'difficulty':
							return difficulties.indexOf(b.difficulty) - difficulties.indexOf(a.difficulty);
					}

					return 0;
				});

			// The results are sorted descendingly by default
			if (state.sortOrder !== 'descending')
				sortedResults.reverse();

			return sortedResults;
		},

		filteredResults(state, getters, rootState, rootGetters)
		{
			return state.results.filter(
				lick => {
					switch (state.bookmarkFilter)
					{
						case 'bookmarked':      return  rootGetters['bookmarks/isBookmarked'](lick.id);
						case 'not-bookmarked':  return !rootGetters['bookmarks/isBookmarked'](lick.id);
						default:                return true;
					}
				});
		},
	},

	mutations: {
		updateResults:                (state, value) => state.results                  = value,

		setCurrentPage:               (state, value) => state.currentPage              = value,
		setBookmarkFilter:            (state, value) => state.bookmarkFilter           = value,
		setSortBy:                    (state, value) => state.sortBy                   = value,
		setSortOrder:                 (state, value) => state.sortOrder                = value,

		setIsPreviewedLickReady:      (state, value) => state.isPreviewedLickReady     = value,
		setPreviewedLick:             (state, value) => state.previewedLick            = value,
		setPreviewedLickProgress:     (state, value) => state.previewedLickProgress    = value,
		setPreviewedLickPlayerState:  (state, value) => state.previewedLickPlayerState = value,

		resetLickPreview(state)
		{
			state.isPreviewedLickReady     = false;
			state.previewedLick            = null;
			state.previewedLickPlayerState = 'stopped';
			state.previewedLickProgress    = 0;
		},

		setNbResultsPerPage(state, value)
		{
			state.nbResultsPerPage = value,

			// Reset the current page number
			state.currentPage = 1;
		}
	},
}
