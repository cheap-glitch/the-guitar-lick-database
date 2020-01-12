
/**
 * stores/main.js
 */

import Vue       from 'vue'
import Vuex      from 'vuex'
import pathify   from '@/modules/pathify'

import bookmarks from '@/stores/bookmarks'
import browse    from '@/stores/browse'
import player    from '@/stores/player'

Vue.use(Vuex);

export default new Vuex.Store(
{
	plugins: [
		pathify.plugin,
	],

	modules: {
		bookmarks,
		browse,
		player,
	},

	state: {
		totalNbLicks: 200,
	},

	mutations: {
		setTotalNbLicks: (_state, _value) => _state.totalNbLicks = parseInt(_value),
	},

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
