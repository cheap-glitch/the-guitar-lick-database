
/**
 * stores/bookmarks.js
 */

import storage from '@/modules/storage';

export default
{
	namespaced: true,

	state: {
		bookmarks: storage.get('bookmarks', []),
	},

	getters: {
		isBookmarked: _state => _id => _state.bookmarks.includes(parseInt(_id)),
	},

	mutations: {
		insertBookmark: (_state, _id) => _state.bookmarks = storage.arrayInsert('bookmarks', parseInt(_id)),
		removeBookmark: (_state, _id) => _state.bookmarks = storage.arrayRemove('bookmarks', parseInt(_id)),
	},
}
