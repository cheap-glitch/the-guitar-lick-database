
/**
 * stores/player.js
 */

import storage                     from '@/modules/storage';
import { inBounds }                from '@/modules/tools';
import { expandTex, transposeTex } from '@/modules/alphatex';

export default
{
	namespaced: true,

	state: {
		lick:              null,

		tonalityShift:     0,
		highestFret:       24,

		scoreType:         storage.get('scoreType', 'mixed'),
		isPickingShown:    true,

		zoom:              storage.get('zoom', 11),
		minZoom:           7,
		maxZoom:           20,

		playerState:       'stopped',

		tempo:             120,
		defaultTempo:      120,
		tempoMin:          10,
		tempoMax:          400,

		volPlayback:       10,
		volMetronome:      10,

		isLickLoaded:      false,
		isLoopingOn:       storage.get('isLoopingOn',   false),
		isMetronomeOn:     storage.get('isMetronomeOn', false),
		isCountdownOn:     storage.get('isCountdownOn', false),

		isSpeedTrainerOn:  false,
		speedTrainer:      {
			start:     80,
			stop:      140,

			loops:     3,
			loopsMin:  1,

			inc:       5,
			incMin:    1,
			incMax:    50,
		}
	},

	getters: {
		lickTexExpanded:   _s             => !_s.lick ? '' : expandTex(_s.lick.tex),
		lickTexTransposed: (_s, _getters) => !_s.lick ? '' : transposeTex(_getters.lickTexExpanded, _s.tonalityShift),
	},

	mutations: {
		setLick:           (_s, _v) => _s.lick           = _v,
		setLickLoaded:     (_s, _v) => _s.isLickLoaded   = _v,
		setTonalityShift:  (_s, _v) => _s.tonalityShift  = _v,
		setPicking:        (_s, _v) => _s.isPickingShown = _v,
		setPlayerState:    (_s, _v) => _s.playerState    = _v,
		setScoreType:      (_s, _v) => { _s.scoreType    = _v; storage.set('scoreType', _v); },

		setTempo:          (_s, _v) => { if (inBounds(_v, _s.minTempo, _s.tempoMax)) _s.tempo        = parseInt(_v) },
		setDefaultTempo:   (_s, _v) => { if (inBounds(_v, _s.minTempo, _s.tempoMax)) _s.defaultTempo = parseInt(_v) },

		setVolPlayback:    (_s, _v) => { if (inBounds(_v, 0, 20)) _s.volPlayback  = parseInt(_v) },
		setVolMetronome:   (_s, _v) => { if (inBounds(_v, 0, 20)) _s.volMetronome = parseInt(_v) },

		zoomIn:            _s => { if (_s.zoom < _s.maxZoom) storage.set('zoom', ++_s.zoom); },
		zoomOut:           _s => { if (_s.zoom > _s.minZoom) storage.set('zoom', --_s.zoom); },

		togglePlayPause:   _s => _s.playerState = _s.playerState === 'playing' ? 'paused' : 'playing',
		toggleLooping:     _s => storage.set('isLoopingOn',   _s.isLoopingOn   = !_s.isLoopingOn),
		toggleMetronome:   _s => storage.set('isMetronomeOn', _s.isMetronomeOn = !_s.isMetronomeOn),
		toggleCountdown:   _s => storage.set('isCountdownOn', _s.isCountdownOn = !_s.isCountdownOn),
	},
}
