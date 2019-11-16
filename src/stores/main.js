
/**
 * stores/main.js
 */

import Vue	   from 'vue';
import Vuex	   from 'vuex';

import bookmarks   from '@/stores/bookmarks';
import browse	   from '@/stores/browse';
import fretboarder from '@/stores/fretboarder';
import player	   from '@/stores/player';

Vue.use(Vuex);

export default new Vuex.Store(
{
	modules: {
		bookmarks,
		browse,
		fretboarder,
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
