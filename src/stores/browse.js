
/**
 * stores/browse.js
 */

import data    from '@/modules/data'
import storage from '@/modules/storage'

export default
{
	namespaced: true,

	state: {
		results:           [],

		bookmarkFilter:    'none',
		sortBy:            storage.get('browse/sortBy',    'date'),
		sortOrder:         storage.get('browse/sortOrder', 'descending'),

		currentPage:       1,
		nbResultsPerPage:  storage.get('browse/nbResultsPerPage', 5),
	},

	getters: {
		nbPages(_state, _getters)
		{
			return Math.ceil(_getters.filteredResults.length / _state.nbResultsPerPage);
		},

		displayedResults(_state, _getters)
		{
			// Keep only the licks on the current page
			return _getters.sortedResults.slice(
				(_state.currentPage - 1)*_state.nbResultsPerPage,
				_state.currentPage*_state.nbResultsPerPage
			);
		},

		sortedResults(_state, _getters)
		{
			let difficulties  = Object.keys(data.difficulties);
			let sortedResults = [..._getters.filteredResults];

			// The results are sorted by added date by default
			if (_state.sortBy !== 'date')
				sortedResults.sort((_a, _b) => {
					switch (_state.sortBy)
					{
						case 'difficulty':
							return difficulties.indexOf(_b.difficulty) - difficulties.indexOf(_a.difficulty);
					}

					return 0;
				});

			// The results are sorted descendingly by default
			if (_state.sortOrder !== 'descending')
				sortedResults.reverse();

			return sortedResults;
		},

		filteredResults(_state, _getters, _rootState, _rootGetters)
		{
			return _state.results.filter(
				_lick => {
					switch (_state.bookmarkFilter)
					{
						case 'bookmarked':      return  _rootGetters['bookmarks/isBookmarked'](_lick.id);
						case 'not-bookmarked':  return !_rootGetters['bookmarks/isBookmarked'](_lick.id);
						default:                return true;
					}
				});
		},
	},

	mutations: {
		updateResults:      (_state, _value) => _state.results        = _value,
		setCurrentPage:     (_state, _value) => _state.currentPage    = _value,
		setBookmarkFilter:  (_state, _value) => _state.bookmarkFilter = _value,
		setSortBy:          (_state, _value) => _state.sortBy         = _value,
		setSortOrder:       (_state, _value) => _state.sortOrder      = _value,

		setNbResultsPerPage(_state, _value)
		{
			_state.nbResultsPerPage = _value,

			// Reset the current page number
			_state.currentPage = 1;
		}
	},
}
