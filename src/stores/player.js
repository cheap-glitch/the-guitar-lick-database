
/**
 * stores/player.js
 */

import { expandTex, transposeTex } from '@/modules/alphatex';

export default
{
	namespaced: true,

	state: {
		lick:		null,

		tonalityShift:	0,
		highestFret:	24,

		scoreType:	'mixed',
		isPickingShown: true,
		zoomLevel:	11,
		minZoom:	7,
		maxZoom:	20,

		playerState:	'stopped',
		tempo:		120,
		volPlayback:	10,
		volMetronome:	10,
		isLickLoaded:	false,
		isLoopingOn:	false,
		isMetronomeOn:	false,
		isCountdownOn:	false,
	},

	getters: {
		lickTexExpanded:   (_state)	      => _state.lick ? expandTex(_state.lick.tex) : '',
		lickTexTransposed: (_state, _getters) => _state.lick ? transposeTex(_getters.lickTexExpanded, _state.tonalityShift) : '',
	},

	mutations: {
		setLick:	   (_state, _value) => _state.lick	    = _value,
		setLickLoaded:	   (_state, _value) => _state.isLickLoaded   = _value,
		setTonalityShift:  (_state, _value) => _state.tonalityShift  = _value,
		setScoreType:	   (_state, _value) => _state.scoreType      = _value,
		setPicking:	   (_state, _value) => _state.isPickingShown = _value,
		setPlayerState:    (_state, _value) => _state.playerState    = _value,

		setTempo:   	   (_state, _value) => { if (10 <= _value && _value <= 400) _state.tempo	       = parseInt(_value) },
		setVolPlayback:    (_state, _value) => { if (0  <= _value && _value <=  20) _state.volPlayback  = parseInt(_value) },
		setVolMetronome:   (_state, _value) => { if (0  <= _value && _value <=  20) _state.volMetronome = parseInt(_value) },

		tempoInc:	   (_state) => { if (_state.tempo < 400) _state.tempo += 5; },
		tempoDec:	   (_state) => { if (_state.tempo >  10) _state.tempo -= 5; },
		zoomIn:		   (_state) => { if (_state.zoomLevel < _state.maxZoom) _state.zoomLevel += 1; },
		zoomOut:	   (_state) => { if (_state.zoomLevel > _state.minZoom) _state.zoomLevel -= 1; },

		togglePlayPause:   (_state) => _state.playerState   = _state.playerState === 'playing' ? 'paused' : 'playing',
		toggleLooping:	   (_state) => _state.isLoopingOn   = !_state.isLoopingOn,
		toggleMetronome:   (_state) => _state.isMetronomeOn = !_state.isMetronomeOn,
		toggleCountdown:   (_state) => _state.isCountdownOn = !_state.isCountdownOn,
	},
}
