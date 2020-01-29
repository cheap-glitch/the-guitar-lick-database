
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

		scoreType:           storage.get('player/scoreType', 'mixed', v => ['tab', 'score', 'mixed'].includes(v)),
		isPickingShown:      true,

		zoom:                storage.get('player/zoom', 11, v => (typeof v == 'number') && (7 <= v && v <= 20)),
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
		isLoopingOn:         storage.get('player/isLoopingOn',   false, v => typeof v == 'boolean'),
		isMetronomeOn:       storage.get('player/isMetronomeOn', false, v => typeof v == 'boolean'),
		isCountdownOn:       storage.get('player/isCountdownOn', false, v => typeof v == 'boolean'),

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
		lickTexExpanded:     s            => !s.lick ? '' : expandTex(s.lick.tex),
		lickTexTransposed:   (s, getters) => !s.lick ? '' : transposeTex(getters.lickTexExpanded, s.tonalityShift),
	},

	mutations: {
		setLick:             (s, v) => s.lick           = v,
		setLickLoaded:       (s, v) => s.isLickLoaded   = v,
		setTonalityShift:    (s, v) => s.tonalityShift  = v,
		setIsPickingShown:   (s, v) => s.isPickingShown = v,
		setPlayerState:      (s, v) => s.playerState    = v,
		setScoreType:        (s, v) => s.scoreType      = v,

		resetNbLoops:        s       => s.nbLoops = 0,
		incrementNbLoops:    s       => s.nbLoops++,

		setTempo:            (s, v) => { if (inBounds(v, s.tempoMin, s.tempoMax)) s.tempo        = parseInt(v) },
		setDefaultTempo:     (s, v) => { if (inBounds(v, s.tempoMin, s.tempoMax)) s.tempoDefault = parseInt(v) },

		setVolPlayback:      (s, v) => { if (inBounds(v, 0, 20)) s.volPlayback  = parseInt(v) },
		setVolMetronome:     (s, v) => { if (inBounds(v, 0, 20)) s.volMetronome = parseInt(v) },

		zoomIn:              s       => { if (s.zoom < s.zoomMax) s.zoom++ },
		zoomOut:             s       => { if (s.zoom > s.zoomMin) s.zoom-- },

		togglePlayPause:     s       => s.playerState   = s.playerState === 'playing' ? 'paused' : 'playing',
		toggleLooping:       s       => s.isLoopingOn   = !s.isLoopingOn,
		toggleMetronome:     s       => s.isMetronomeOn = !s.isMetronomeOn,
		toggleCountdown:     s       => s.isCountdownOn = !s.isCountdownOn,

		setStStart:          (s, v) => { if (inBounds(v, s.tempoMin, s.tempoMax)) s.stStart = v },
		setStStop:           (s, v) => { if (inBounds(v, s.tempoMin, s.tempoMax)) s.stStop  = v },
		setStInc:            (s, v) => { if (inBounds(v, s.stIncMin, s.stIncMax)) s.stInc   = v },
		setStLoops:          (s, v) => { if (v >= s.stLoopsMin)                   s.stLoops = v },

		setIsSpeedTrainerOn: (s, v) => s.isSpeedTrainerOn = v,
		setStCurrentTempo:   (s, v) => s.stCurrentTempo   = v,
	},
}
