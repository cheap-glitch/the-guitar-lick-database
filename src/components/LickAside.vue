

<!-- LickAside.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.LickAside

	//----------------------------------------------------------------------
	//- Playback control
	//----------------------------------------------------------------------
	VFold(title="Playback")
		div.column
			div.toolbar
				//- Play/pause
				VButton(
					tooltip="Play/pause (space)"
					:icon="playerState === 'playing' ? 'pause' : 'play'"
					:is-disabled="!isLickLoaded"

					@click="togglePlayPause"
					)
				//- Stop
				VButton(
					tooltip="Stop (s)"
					icon="stop"
					:is-disabled="!isLickLoaded"

					@click="setPlayerState('stopped')"
					)
				//- Loop
				VButton(
					tooltip="Loop (l)"
					icon="undo-alt"
					:is-active="isLoopingOn"
					:is-disabled="!isLickLoaded"

					@click="toggleLooping"
					)
				//- Metronome
				VButton(
					tooltip="Metronome (m)"
					icon="drum"
					:is-active="isMetronomeOn"
					:is-disabled="!isLickLoaded"

					@click="toggleMetronome"
					)
				//- Countdown
				VButton(
					tooltip="Countdown (c)"
					icon="stopwatch"
					:is-active="isCountdownOn"
					:is-disabled="!isLickLoaded"

					@click="toggleCountdown"
					)

			//- Tempo
			div.toolbar
				//- label.label Tempo
				VNumberInput.input(
					id="lick-tempo"
					inner-label="BPM"

					:defaultValue="defaultTempo"
					:min="tempoMin"
					:max="tempoMax"
					:is-disabled="!isLickLoaded"

					v-model.number="tempo"
					)

	//----------------------------------------------------------------------
	//- Playback & metronome volumes
	//----------------------------------------------------------------------
	VFold(title="Volumes")
		//- Playback volume
		div.toolbar
			vue-slider.slider(
				:min="0"
				:max="20"
				:interval="1"
				:disabled="!isLickLoaded"
				lazy

				v-model="volPlayback"
				)
			p.text-volume {{ volPlayback }}
		//- Metronome volume
		div.toolbar
			vue-slider.slider(
				:min="0"
				:max="20"
				:interval="1"
				:disabled="!isLickLoaded"
				lazy

				v-model="volMetronome"
				)
			p.text-volume {{ volMetronome }}

	//----------------------------------------------------------------------
	//- Display & score settings
	//----------------------------------------------------------------------
	VFold(title="Score settings")
		div.toolbar
			//- Zoom out
			VButton(
				tooltip="Zoom out (-)"
				icon="search-minus"
				:is-disabled="!isLickLoaded || zoom == zoomMin"

				@click="zoomOut"
				)
			//- Zoom in
			VButton(
				tooltip="Zoom in (+)"
				icon="search-plus"
				:is-disabled="!isLickLoaded || zoom == zoomMax"

				@click="zoomIn"
				)
		//- Score type
		VPillRadio(
			id="score-type"
			label="Score type"
			:choices="{ 'tab only': 'tab', 'score only': 'score', 'both': 'mixed' }"
			:is-disabled="!isLickLoaded"

			v-model="scoreType"
			)
		//- Transposition
		VSelect(
			id="transposition-tool"
			:options="transpositions"
			:is-disabled="!isLickLoaded"

			v-model="tonalityShift"
			)
		//- Picking suggestions
		VPillRadio(
			v-show="lickHasPickingSuggestions"

			id="is-picking-shown"
			label="Show picking suggestions"
			:choices="{ 'yes': true, 'no': false }"

			v-model="isPickingShown"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapState, mapGetters, mapMutations } from 'vuex';

import data                from '@/modules/data';
import { Hotkeys }         from '@/modules/hotkeys';
import { getFretList }     from '@/modules/alphatex';
import { getIntervalNote } from '@/modules/music';

export default {
	name: 'LickAside',

	static() {
		return {
			data: data,
			hotkeys: {},
		}
	},

	data() {
		return {
		}
	},

	computed: {
		transpositions()
		{
			if (!this.lick) return [];

			const transpositions = [];
			for (let i=this.maxTonalityShiftDown; i<=this.maxTonalityShiftUp; i++)
			{
				const tonality = this.data.tonalities[getIntervalNote(this.lick.tonality, i)];

				transpositions.push({
					value: i,
					name:  (i === 0)
						? `Original tonality (${tonality})`
						: `${i > 0 ? '+' : ''}${i} half-step${Math.abs(i) > 1 ? 's' : ''} (${tonality})`
				});
			}

			return transpositions;

		},
		maxTonalityShiftUp()
		{
			return this.highestFret - Math.max(...this.fretList);
		},
		maxTonalityShiftDown()
		{
			return -Math.min(...this.fretList);
		},
		fretList()
		{
			return this.lick ? getFretList(this.lickTexExpanded) : [];
		},
		lickHasPickingSuggestions()
		{
			return this.lick ? this.lick.tex.includes('↑') || this.lick.tex.includes('↓') : false;
		},

		scoreType:
		{
			get()   { return this.$store.state.player.scoreType;         },
			set(_v) { this.$store.commit('player/setScoreType', _v);     },
		},
		tempo:
		{
			get()   { return this.$store.state.player.tempo;             },
			set(_v) { this.$store.commit('player/setTempo', _v);         },
		},
		volPlayback:
		{
			get()   { return this.$store.state.player.volPlayback;       },
			set(_v) { this.$store.commit('player/setVolPlayback', _v);   },
		},
		volMetronome:
		{
			get()   { return this.$store.state.player.volMetronome;      },
			set(_v) { this.$store.commit('player/setVolMetronome', _v);  },
		},
		tonalityShift:
		{
			get()   { return this.$store.state.player.tonalityShift;     },
			set(_v) { this.$store.commit('player/setTonalityShift', _v); },
		},
		isPickingShown:
		{
			get()   { return this.$store.state.player.isPickingShown;    },
			set(_v) { this.$store.commit('player/setPicking', _v);       },
		},

		...mapState('player', [
			'lick',
			'highestFret',

			'playerState',

			'defaultTempo',
			'tempoMin',
			'tempoMax',

			'isLickLoaded',
			'isLoopingOn',
			'isMetronomeOn',
			'isCountdownOn',

			'zoom',
			'zoomMin',
			'zoomMax',
		]),

		...mapGetters('player', [
			'lickTexExpanded',
			'lickTexTransposed',
		]),
	},

	watch: {
		isLickLoaded: function() { if (this.isLickLoaded) this.hotkeys.activate(); },
	},

	created()
	{
		this.hotkeys = new Hotkeys({
			' ': this.togglePlayPause,
			's': () => this.setPlayerState('stopped'),
			'l': this.toggleLooping,
			'm': this.toggleMetronome,
			'c': this.toggleCountdown,
			'-': this.zoomOut,
			'+': this.zoomIn,
		}, true);
	},

	beforeDestroy()
	{
		this.hotkeys.destroy();
	},

	methods: {
		editTempo()
		{
			if (!this.isLickLoaded) return;

			this.isEditingTempo = true;
			this.$nextTick(() => {
				this.$refs.tempoInput.focus();
				this.$refs.tempoInput.select();
			});
		},

		...mapMutations('player', [
			'setPlayerState',
			'togglePlayPause',
			'toggleLooping',
			'toggleMetronome',
			'toggleCountdown',
			'zoomIn',
			'zoomOut',
		])
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.LickAside {
	@include space-children-v(20px);
}

.column {
	display: flex;
	flex-direction: column;
	@include space-children-v(10px);
}

.toolbar {
	display: flex;
	align-items: center;
	@include space-children-h(5px);
}

.input {
	align-self: flex-start;
}

.slider {
	flex: 1 1 100%;
}

.text-volume {
	user-select: none;
}

.text-volume {
	display: block;
	width: 20px;
}

</style>
<!--}}}-->

<!--{{{ Global SCSS -->
<style lang='scss'>

// Set the theme color and import the default style for the custom sliders
$themeColor: $color-sun;
@import '~vue-slider-component/lib/theme/default';

</style>
<!--}}}-->
