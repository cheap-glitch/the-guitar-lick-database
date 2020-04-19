

<!-- VAlphatab.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VAlphatab(
	:style="fixedHeight"
	v-mods="{ isLayoutPage: layout === 'page' }"
	)
	div(ref="alphatab")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import Vue                          from 'vue'

import colors                       from '@/styles/colorscheme.scss'
import { expandTex }                from '@/modules/alphatex'
import { forEach as objectForEach } from '@/modules/object'

const lightModeColorscheme = {
	barSeparatorColor:    '#000000',
	mainGlyphColor:       '#000000',
	secondaryGlyphColor:  '#000000',
	staffLineColor:       '#aaaaaa',
};

const darkModeColorscheme = {
	barSeparatorColor:    colors.oxfordBlue,
	mainGlyphColor:       colors.athensGray,
	secondaryGlyphColor:  colors.oxfordBlue,
	staffLineColor:       colors.oxfordBlue,
};

export default {
	name: 'VAlphatab',

	props: {
		tempo: {
			type: Number,
			default: 120,
			validator: v => v > 0
		},
		timeSignature: {
			type: String,
			default: '4/4',
			validator: v => /1?[1-9]\/1?[1-9]/.test(v)
		},
		tex: {
			type: String,
			default: '',
		},
		isTexExpanded: {
			type: Boolean,
			default: false,
		},
		layout: {
			type: String,
			default: 'horizontal',
			validator: v => ['page', 'horizontal'].includes(v)
		},
		zoom: {
			type: Number,
			default: 10,
			validator: v => (0 < v) && (v <= 20)
		},
		scoreType: {
			type: String,
			default: 'tab',
			validator: v => ['score', 'tab', 'mixed'].includes(v)
		},
		playerState: {
			type: String,
			default: 'stopped',
			validator: v => ['playing', 'paused', 'stopped'].includes(v)
		},
		volPlayback: {
			type: Number,
			default: 10,
			validator: v => (0 <= v) && (v <= 20),
		},
		volMetronome: {
			type: Number,
			default: 10,
			validator: v => (0 <= v) && (v <= 20),
		},
		isPlaybackActive: {
			type: Boolean,
			default: false,
		},
		isLoopingOn: {
			type: Boolean,
			default: false,
		},
		isMetronomeOn: {
			type: Boolean,
			default: false,
		},
		isCountdownOn: {
			type: Boolean,
			default: false,
		},
		isPickingShown: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			fixedHeight: {},
		}
	},

	computed: {
		tablature()
		{
			if (!this.tex.length) return '';

			let tab = this.tex.trim();

			// Remove picking strokes if needed
			// @TODO: this is a hack, should be fixed better (why is 'isTexExpanded' needed?
			if (!this.isPickingShown) tab = tab.replace(/(?:↑|↓|{sd}|{su}|su|sd)/g, '');

			// Expand the alphatex and add the relevant metadata
			tab = `\\tempo ${this.tempo} .
			       \\ts ${this.timeSignature.replace('/', ' ')}
			       ${this.countdownBar}
			       ${!this.isTexExpanded ? expandTex(tab) : tab}`;

			return tab;
		},
		countdownBar()
		{
			if (!this.isCountdownOn) return '';

			const nbPerBar = this.timeSignature.split('/')[0];
			const timeUnit = this.timeSignature.split('/')[1];

			return `${this.isMetronomeOn ? 'r.1' : `x.6.${timeUnit}*${nbPerBar}`} |`;
		},
		scale()
		{
			return this.zoom / 10;
		},
		alphatabScoreType()
		{
			return (this.scoreType === 'mixed') ? 'default' : this.scoreType;
		},
		colorscheme()
		{
			return this.$store.state.isDarkModeOn ? darkModeColorscheme : lightModeColorscheme;
		},
	},

	watch: {
		tablature:          'updateScore',

		scale:              'updateLayout',
		alphatabScoreType:  'updateLayout',
		colorscheme:        'updateColorscheme',

		isPlaybackActive:   'updatePlayer',
		playerState:        'updatePlayerState',
		volPlayback:        'updateVolPlayback',
		volMetronome:       'updateVolMetronome',
		isMetronomeOn:      'updateVolMetronome',
		isLoopingOn:        'updateLooping',
	},

	created()
	{
		this.$alphatab = null;
	},

	mounted()
	{
		this.initScore();
	},

	beforeDestroy()
	{
		this.$alphatab.destroy();
	},

	methods: {
		initScore()
		{
			this.$alphatab = new alphaTab.platform.javaScript.AlphaTabApi(this.$refs.alphatab, {
				core: {
					logLevel:                     process.env.NODE_ENV === 'development' ? 'warning' :  'none',
					fontDirectory:                '../font/',
					enableLazyLoading:            false,
				},
				display: {
					scale:                        this.scale,
					layoutMode:                   this.layout,
					staveProfile:                 this.alphatabScoreType,
					resources:                    this.colorscheme,
				},
				notation: {
					rhythmMode:                   'showwithbars',
					hideInfo:                     true,
					hideTuning:                   true,
					hideTrackNames:               true,
					extendBendArrowsOnTiedNotes:  false,
				},
				player: {
					enablePlayer:                 this.isPlaybackActive,
					enableCursor:                 true,
					scrollMode:                   'off',
					soundFont:                    '/soundfonts/default.sf2',
				},
			});

			// When the score is fully rendered
			this.$alphatab.addRenderFinished(() =>
			{
				this.$emit('score-rendered');

				// Lock the min-height of the wrapper to prevent layout spasms when the score is reloaded
				Vue.nextTick(() => this.fixedHeight = { 'min-height': this.$refs.alphatab.children.item(0).style.height });
			});

			// Send events during the loading of the soundfile
			this.$alphatab.addSoundFontLoad(event => this.$emit('player-loading', Math.floor((event.loaded / event.total) * 100)));

			// When the player is ready
			this.$alphatab.addReadyForPlayback(() =>
			{
				// Initialize the playback settings
				this.updateVolPlayback();
				this.updateVolMetronome();
				this.updateLooping();

				this.$emit('player-ready');
			});

			// When the playback reaches the end of the score
			this.$alphatab.addPlayerFinished(() =>
			{
				// Send an event
				this.$emit('player-reached-end');

				// Also send a stopping event if the playback is not looping
				if (!this.isLoopingOn) this.$emit('player-stopped');
			});

			// Draw the score
			this.updateScore();
		},
		updateScore()
		{
			if (!this.tablature.length) return;

			this.$store.commit('player/setPlayerState', 'stopped');
			this.$alphatab.tex(this.tablature);
		},
		updateLayout()
		{
			this.updateSettings('display', {
				scale:         this.scale,
				staveProfile:  this.alphatabScoreType,
			});

			this.$alphatab.render();
		},
		updateColorscheme()
		{
			this.$alphatab.destroy();
			this.initScore();
		},
		updatePlayer()
		{
			this.updateSettings('player', { enablePlayer: this.isPlaybackActive });
		},
		updatePlayerState()
		{
			switch (this.playerState)
			{
				case 'playing':
					// Show the beat cursor
					document.getElementsByClassName('at-cursor-beat').item(0).classList.add('is-visible');

					this.$alphatab.play();
					break;

				case 'paused':
					this.$alphatab.pause();
					break;

				case 'stopped':
					// Hide the beat cursor
					document.getElementsByClassName('at-cursor-beat').item(0).classList.remove('is-visible');

					this.$alphatab.stop();
					break;
			}
		},
		updateVolPlayback()
		{
			this.$alphatab.changeTrackVolume([this.$alphatab.score.tracks[0]], this.volPlayback / 10);
		},
		updateVolMetronome()
		{
			this.$alphatab.metronomeVolume = this.isMetronomeOn ? this.volMetronome / 10 : 0.0;
		},
		updateLooping()
		{
			this.$alphatab.isLooping = this.isLoopingOn;
		},
		updateSettings(category, settings)
		{
			objectForEach(settings, (setting, value) => this.$alphatab.settings[category][setting] = value);
			this.$alphatab.updateSettings();
		},
	}
}

</script>
<!--}}}-->


<!--{{{ Fixes for the rendering of alphatab -->
<style lang="scss">

.at-highlight {
	color: $color--portage;
}

.at-cursor-beat {
	display: none;

	width: 3px;

	// Align the beat cursor with the score
	transform: translateY(-60px);

	background-color: $color--portage;

	&.is-visible {
		display: block;
	}
}

// Hide the copyright text
.at-surface-svg:last-child { display: none; }

// Hide the bar numbers
.at-surface-svg text[fill="#C80000"] { display: none; }

// Hide the bracket at the beginning of the score
.at-surface-svg > path:last-child,
.at-surface-svg > rect:last-of-type,
.at-surface-svg > path:nth-last-child(2) {
	display: none;
}

// Remove the empty space above the score in page mode
.VAlphatab.is-layout-page .at-surface-svg {
	&:first-child,
	&:nth-child(2) {
		display: none;
	}
}

</style>
<!--}}}-->
