
/**
 * stores/fretboarder.js
 */

import Storage from '@/modules/storage';

export default
{
	namespaced: true,

	state: {
		fretboardFlipped: Storage.get('fretboardFlipped', false),
	},

	mutations: {
		toggleFretboardFlip: _state => _state.fretboardFlipped = !_state.fretboardFlipped,
	},
}
