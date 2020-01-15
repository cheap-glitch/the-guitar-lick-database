
/**
 * stores/player.js
 */

import storage                      from '@/modules/storage'
import { inBounds }                 from '@/modules/tools'
import { expandTex, transposeTex }  from '@/modules/alphatex'

export default
{
	namespaced: true,

	state: {
		lick:                null,

		tonalityShift:       0,
		highestFret:         24,

		scoreType:           storage.get('scoreType', 'mixed'),
		isPickingShown:      true,

		zoom:                storage.get('zoom', 11),
		zoomMin:             7,
		zoomMax:             20,

		playerState:         'stopped',
		nbLoops:             0,

		tempo:               120,
		tempoDefault:        120,
		tempoMin:            10,
		tempoMax:            400,

		volPlayback:         10,
		volMetronome:        10,

		isLickLoaded:        false,
		isLoopingOn:         storage.get('isLoopingOn',   false),
		isMetronomeOn:       storage.get('isMetronomeOn', false),
		isCountdownOn:       storage.get('isCountdownOn', false),

		stStart:             80,
		stStartDefault:      80,
		stStop:              140,
		stStopDefault:       140,
		stLoops:             3,
		stLoopsDefault:      3,
		stLoopsMin:          1,
		stInc:               5,
		stIncDefault:        5,
		stIncMin:            1,
		stIncMax:            50,

		isSpeedTrainerOn:    false,
		stCurrentTempo:      80,
	},

	getters: {
		lickTexExpanded:     _s             => !_s.lick ? '' : expandTex(_s.lick.tex),
		lickTexTransposed:   (_s, _getters) => !_s.lick ? '' : transposeTex(_getters.lickTexExpanded, _s.tonalityShift),
	},

	mutations: {
		setLick:             (_s, _v) => _s.lick           = _v,
		setLickLoaded:       (_s, _v) => _s.isLickLoaded   = _v,
		setTonalityShift:    (_s, _v) => _s.tonalityShift  = _v,
		setIsPickingShown:   (_s, _v) => _s.isPickingShown = _v,
		setPlayerState:      (_s, _v) => _s.playerState    = _v,
		setScoreType:        (_s, _v) => _s.scoreType      = _v,

		resetNbLoops:        _s       => _s.nbLoops = 0,
		incrementNbLoops:    _s       => _s.nbLoops++,

		setTempo:            (_s, _v) => { if (inBounds(_v, _s.tempoMin, _s.tempoMax)) _s.tempo        = parseInt(_v) },
		setDefaultTempo:     (_s, _v) => { if (inBounds(_v, _s.tempoMin, _s.tempoMax)) _s.tempoDefault = parseInt(_v) },

		setVolPlayback:      (_s, _v) => { if (inBounds(_v, 0, 20)) _s.volPlayback  = parseInt(_v) },
		setVolMetronome:     (_s, _v) => { if (inBounds(_v, 0, 20)) _s.volMetronome = parseInt(_v) },

		zoomIn:              _s       => { if (_s.zoom < _s.zoomMax) _s.zoom++ },
		zoomOut:             _s       => { if (_s.zoom > _s.zoomMin) _s.zoom-- },

		togglePlayPause:     _s       => _s.playerState   = _s.playerState === 'playing' ? 'paused' : 'playing',
		toggleLooping:       _s       => _s.isLoopingOn   = !_s.isLoopingOn,
		toggleMetronome:     _s       => _s.isMetronomeOn = !_s.isMetronomeOn,
		toggleCountdown:     _s       => _s.isCountdownOn = !_s.isCountdownOn,

		setStStart:          (_s, _v) => { if (inBounds(_v, _s.tempoMin, _s.tempoMax)) _s.stStart = _v },
		setStStop:           (_s, _v) => { if (inBounds(_v, _s.tempoMin, _s.tempoMax)) _s.stStop  = _v },
		setStInc:            (_s, _v) => { if (inBounds(_v, _s.stIncMin, _s.stIncMax)) _s.stInc   = _v },
		setStLoops:          (_s, _v) => { if (_v >= _s.stLoopsMin)                    _s.stLoops = _v },

		setIsSpeedTrainerOn: (_s, _v) => _s.isSpeedTrainerOn = _v,
		setStCurrentTempo:   (_s, _v) => _s.stCurrentTempo   = _v,
	},
}
