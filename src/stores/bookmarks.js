
/**
 * stores/bookmarks.js
 */

import Storage from '@/modules/storage';

export default
{
	namespaced: true,

	state: {
		bookmarks: Storage.get('bookmarks', []),
	},

	getters: {
		isBookmarked: _state => _id => _state.bookmarks.includes(parseInt(_id)),
	},

	mutations: {
		insertBookmark: (_state, _id) => _state.bookmarks = Storage.insert('bookmarks', parseInt(_id)),
		removeBookmark: (_state, _id) => _state.bookmarks = Storage.remove('bookmarks', parseInt(_id)),
	},
}
