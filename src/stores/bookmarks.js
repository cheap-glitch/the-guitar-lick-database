
/**
 * stores/bookmarks.js
 */

import storage from '@/modules/storage'

export default
{
	namespaced: true,

	state: {
		bookmarks: storage.get('bookmarks/bookmarks', [], v => Array.isArray(v)),
	},

	getters: {
		isBookmarked: state => id => state.bookmarks.includes(parseInt(id)),
	},

	mutations: {
		insertBookmark: (state, id) => state.bookmarks = storage.arrayInsert('bookmarks', parseInt(id)),
		removeBookmark: (state, id) => state.bookmarks = storage.arrayRemove('bookmarks', parseInt(id)),
	},
}
