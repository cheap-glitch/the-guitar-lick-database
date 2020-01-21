
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
const storeOnMutation = _store => _store.subscribe(function(_mutation, _state)
{
	const saveUponMutations = {
		'toggleIsDarkModeOn':          'isDarkModeOn',

		'browse/setSortBy':            { name: 'browse/sortBy',           value: _state.browse.sortBy           },
		'browse/setSortOrder':         { name: 'browse/sortOrder',        value: _state.browse.sortOrder        },
		'browse/setNbResultsPerPage':  { name: 'browse/nbResultsPerPage', value: _state.browse.nbResultsPerPage },

		'player/setScoreType':         { name: 'player/scoreType',        value: _state.player.scoreType        },
		'player/zoom(In|Out)':         { name: 'player/zoom',             value: _state.player.zoom             },
		'player/toggleLooping':        { name: 'player/isLoopingOn',      value: _state.player.isLoopingOn      },
		'player/toggleMetronome':      { name: 'player/isMetronomeOn',    value: _state.player.isMetronomeOn    },
		'player/toggleCountdown':      { name: 'player/isCountdownOn',    value: _state.player.isCountdownOn    },
	};

	objectForEach(saveUponMutations, function(__key, __prop)
	{
		// Check that the name of the mutation matches the key
		const rx = new RegExp(`^${__key}$`);
		if (!rx.test(_mutation.type)) return;

		// Execute the callback to get the prop name or object
		const prop = typeof __prop == 'function' ? __prop(_mutation.type) : __prop;

		storage.set(
			isObject(prop) ? prop.name  : prop,
			isObject(prop) ? prop.value : _state[prop]
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
		totalNbLicks:  200,
		progressBar:   0,

		isDarkModeOn:  storage.get('isDarkModeOn', true, _v => typeof _v == 'boolean'),
	},

	getters: {
		darkMode: _state => ({ 'dark-mode': _state.isDarkModeOn }),
	},

	mutations: {
		setTotalNbLicks:     (_state, _value) => _state.totalNbLicks = parseInt(_value),
		setProgressBar:      (_state, _value) => _state.progressBar  = _value,
		toggleIsDarkModeOn:  _state           => _state.isDarkModeOn = !_state.isDarkModeOn,
	},

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
