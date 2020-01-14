

<!-- LickAside.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.LickAside

	//----------------------------------------------------------------------
	//- Playback control
	//----------------------------------------------------------------------
	VFold(title="Playback")
		div.column
			div.toolbar
				//- Play/pause
				VButton(
					tooltip="Play/pause (p)"
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
			VNumberInput.input(
				id="lick-tempo"
				label-right="BPM"

				:default-value="tempoDefault"
				:min="tempoMin"
				:max="tempoMax"
				:is-disabled="!isLickLoaded"

				v-model.number="tempo"
				)

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
	//- Speed trainer
	//----------------------------------------------------------------------
	VFold(title="Speed trainer")

		//- Controls
		div.toolbar
			VButton(
				tooltip="Toggle the speed trainer"
				icon="dumbbell"
				:is-active="isSpeedTrainerOn"
				:is-disabled="!isLickLoaded"

				@click="toggleSpeedTrainer"
				)
			VButton(
				tooltip="Reset the speed trainer"
				icon="undo-alt"
				:is-disabled="!isLickLoaded"

				@click="resetSpeedTrainer"
				)

		//- Infos
		p(v-show="isSpeedTrainerOn") Status: {{ stCurrentLoop }} / {{ stLoops }}, {{ stCurrentTempo }} BPM

		//- Starting & goal tempos
		div.toolbar: VNumberInput(
			id="st-tempo-start"
			label-left="Start at"
			label-right="BPM"

			:default-value="stStartDefault"
			:min="tempoMin"
			:max="tempoMax"
			:is-disabled="!isLickLoaded || isSpeedTrainerOn"

			v-model.number="stStart"
			)
		div.toolbar: VNumberInput(
			id="st-tempo-stop"
			label-left="Stop at"
			label-right="BPM"

			:default-value="stStopDefault"
			:min="tempoMin"
			:max="tempoMax"
			:is-disabled="!isLickLoaded || isSpeedTrainerOn"

			v-model.number="stStop"
			)

		//- Number of loops
		div.toolbar: VNumberInput(
			id="st-tempo-loops"
			label-left="Loop"
			label-right="times"

			:default-value="stLoopsDefault"
			:min="stLoopsMin"
			:is-disabled="!isLickLoaded || isSpeedTrainerOn"

			v-model.number="stLoops"
			)

		//- Increment
		div.toolbar: VNumberInput(
			id="st-tempo-inc"
			label-left="Then add"
			label-right="BPM"

			:default-value="stIncDefault"
			:min="stIncMin"
			:max="stIncMax"
			:is-disabled="!isLickLoaded || isSpeedTrainerOn"

			v-model.number="stInc"
			)

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

import { mapMutations }    from 'vuex'
import { get, sync }       from 'vuex-pathify'

import data                from '@/modules/data'
import { Hotkeys }         from '@/modules/hotkeys'
import { getFretList }     from '@/modules/alphatex'
import { getIntervalNote } from '@/modules/music'

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
			stCurrentLoop: 0,
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

		...get('player', [
			'lick',
			'highestFret',

			'playerState',
			'nbLoops',

			'tempoDefault',
			'tempoMin',
			'tempoMax',

			'isLickLoaded',
			'isLoopingOn',
			'isMetronomeOn',
			'isCountdownOn',

			'zoom',
			'zoomMin',
			'zoomMax',

			'stStartDefault',
			'stStopDefault',
			'stLoopsMin',
			'stLoopsDefault',
			'stIncMin',
			'stIncMax',
			'stIncDefault',

			'lickTexExpanded',
			'lickTexTransposed',
		]),

		...sync('player', [
			'scoreType',
			'tempo',

			'volPlayback',
			'volMetronome',

			'tonalityShift',

			'stStart',
			'stStop',
			'stInc',
			'stLoops',
			'stCurrentTempo',

			'isPickingShown',
			'isSpeedTrainerOn',
		]),
	},

	watch: {
		nbLoops: 'updateSpeedTrainer',

		// Only activate the hotkeys when the lick if full loaded
		isLickLoaded: function() { if (this.isLickLoaded) this.hotkeys.activate(); },
	},

	created()
	{
		this.hotkeys = new Hotkeys({
			'p': this.togglePlayPause,
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
		toggleSpeedTrainer()
		{
			this.isSpeedTrainerOn = !this.isSpeedTrainerOn;
		},
		resetSpeedTrainer()
		{
			this.stCurrentLoop    = 0;
			this.stCurrentTempo   = this.stStart;
		},
		updateSpeedTrainer()
		{
			if (!this.isSpeedTrainerOn) return;

			if (++this.stCurrentLoop >= this.stLoops)
			{
				this.stCurrentLoop   = 0;
				this.stCurrentTempo += this.stInc;

				if (this.stCurrentTempo > this.stStop)
					this.isSpeedTrainerOn = false;
			}
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
<style lang="scss" scoped>

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
