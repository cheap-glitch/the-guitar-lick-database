
/**
 * stores/main.js
 */

import Vue                         from 'vue'
import Vuex                        from 'vuex'

import bookmarks                   from '@/stores/bookmarks'
import browse                      from '@/stores/browse'
import player                      from '@/stores/player'

import pathify                     from '@/modules/pathify'
import storage                     from '@/modules/storage'
import { isObject, objectForEach } from '@/modules/object'

/**
 * Plugin to automatically save some state properties in the local storage upon certain mutations
 */
const storeOnMutation = store => store.subscribe(function(mutation, state)
{
	const saveUponMutations = {
		'toggleIsDarkModeOn':          'isDarkModeOn',

		'browse/setSortBy':            { name: 'browse/sortBy',           value: state.browse.sortBy           },
		'browse/setSortOrder':         { name: 'browse/sortOrder',        value: state.browse.sortOrder        },
		'browse/setNbResultsPerPage':  { name: 'browse/nbResultsPerPage', value: state.browse.nbResultsPerPage },

		'player/setScoreType':         { name: 'player/scoreType',        value: state.player.scoreType        },
		'player/zoom(In|Out)':         { name: 'player/zoom',             value: state.player.zoom             },
		'player/toggleLooping':        { name: 'player/isLoopingOn',      value: state.player.isLoopingOn      },
		'player/toggleMetronome':      { name: 'player/isMetronomeOn',    value: state.player.isMetronomeOn    },
		'player/toggleCountdown':      { name: 'player/isCountdownOn',    value: state.player.isCountdownOn    },
	};

	objectForEach(saveUponMutations, function(key, value)
	{
		// Check that the name of the mutation matches the key
		const rx = new RegExp(`^${key}$`);
		if (!rx.test(mutation.type)) return;

		// Execute the callback to get the prop name or object
		const prop = typeof value == 'function' ? value(mutation.type) : value;

		storage.set(
			isObject(prop) ? prop.name  : prop,
			isObject(prop) ? prop.value : state[prop]
		);
	});
});

Vue.use(Vuex);
export default new Vuex.Store(
{
	test: true,

	plugins: [
		pathify.plugin,
		storeOnMutation,
	],

	modules: {
		bookmarks,
		browse,
		player,
	},

	state: {
		totalNbLicks:   200,

		progressBar:    0,
		progressBarMax: 90,

		isDarkModeOn:   storage.get('isDarkModeOn', true, v => typeof v == 'boolean'),
	},

	getters: {
		darkMode: state => ({ 'dark-mode': state.isDarkModeOn }),
	},

	mutations: {
		setTotalNbLicks:     (state, value) => state.totalNbLicks   = parseInt(value),

		setProgressBar:      (state, value) => state.progressBar    = value,
		setProgressBarMax:   (state, value) => state.progressBarMax = value,

		toggleIsDarkModeOn:  state          => state.isDarkModeOn   = !state.isDarkModeOn,
	},

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
