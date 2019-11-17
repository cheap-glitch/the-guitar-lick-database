

<!-- VAlphatab.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.VAlphatab(
	:class="{ 'is-layout-page': layout === 'page' }"
	)
	div(ref="alphatab")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { expandTex } from '@/modules/alphatex';

export default {
	name: 'VAlphatab',

	props: {
		tempo: {
			type: Number,
			default: 120,
			validator: _v => _v > 0
		},
		timeSignature: {
			type: String,
			default: '4/4',
			validator: _v => /1?[1-9]\/1?[1-9]/.test(_v)
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
			validator: _v => ['page', 'horizontal'].includes(_v)
		},
		zoom: {
			type: Number,
			default: 10,
			validator: _v => (0 < _v) && (_v <= 20)
		},
		scoreType: {
			type: String,
			default: 'tab',
			validator: _v => ['score', 'tab', 'mixed'].includes(_v)
		},
		playerState: {
			type: String,
			default: 'stopped',
			validator: _v => ['playing', 'paused', 'stopped'].includes(_v)
		},
		volPlayback: {
			type: Number,
			default: 10,
			validator: _v => (0 <= _v) && (_v <= 20),
		},
		volMetronome: {
			type: Number,
			default: 10,
			validator: _v => (0 <= _v) && (_v <= 20),
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

	static() {
		return {
			alphatab:	null,
			soundFontPath:	'/soundfonts/default.sf2',
		}
	},

	data() {
		return {
			isSoundFontLoaded: false,
		}
	},

	computed: {
		tablature()
		{
			if (!this.tex.length) return '';

			let tab = this.tex.trim();

			// Remove picking strokes if needed
			if (!this.isPickingShown)
				tab = tab.replace(/(↑|↓)/g, '');

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
	},

	watch: {
		tablature:	   'drawScore',

		scale:		   'updateRendering',
		alphatabScoreType: 'updateRendering',

		playerState:	   'updatePlayerState',
		volPlayback:	   'updateVolPlayback',
		volMetronome:	   'updateVolMetronome',
		isMetronomeOn:	   'updateVolMetronome',
		isLoopingOn:	   'updateLooping',

		isPlaybackActive:  'loadSoundFont',
	},

	// Create the alphaTab instance only when 'window' exists
	mounted()
	{
		const alphatabSettings = {
			logging: process.env.NODE_ENV === 'development' ? 'warning' : 'none',
			fontDirectory: '../font/',

			// General rendering settings
			scale: this.scale,
			layout: {
				mode: this.layout,
				additionalSettings: {
					hideInfo:	true,
					hideTuning:	true,
					hideTrackNames:	true,
				}
			},

			// Score rendering settings
			extendBendArrowsOnTiedNotes: false,
			staves: {
				id: this.alphatabScoreType,
				additionalSettings: {
					rhythm: true,
				}
			},

			// Player settings
			cursor: true,
			autoScroll: 'off',
		};

		// Load a soundfile if the playback is requested
		if (this.isPlaybackActive)
		{
			this.isSoundFontLoaded  = true;
			alphatabSettings.player = this.soundFontPath;
		}

		this.alphatab = new alphaTab.platform.javaScript.AlphaTabApi(this.$refs.alphatab, alphatabSettings);

		// Send events while the soundfont is loading (add the percentage loaded)
		this.alphatab.addSoundFontLoad(_event => this.$emit('player-loading', (_event.loaded / _event.total) * 100));

		// Send an event when the score is fully rendered
		this.alphatab.addRenderFinished(() => this.$emit('score-rendered'));

		this.alphatab.addReadyForPlayback(() =>
		{
			// Initialize the playback settings
			this.updateVolPlayback();
			this.updateVolMetronome();
			this.updateLooping();

			// Send an event when the playback is ready
			this.$emit('player-ready');
		});

		// Send an event whenever the playback reaches the end of the score
		this.alphatab.addPlayerFinished(() => this.$emit('player-stopped'));

		this.drawScore();
	},

	beforeDestroy()
	{
		this.alphatab.destroy();
	},

	methods: {
		drawScore()
		{
			if (this.tablature.length)
				this.alphatab.tex(this.tablature);
		},
		updateRendering()
		{
			this.alphatab.settings.scale     = this.scale;
			this.alphatab.settings.staves.id = this.alphatabScoreType;

			this.alphatab.updateSettings();
			this.alphatab.render();
		},
		updatePlayerState()
		{
			switch (this.playerState)
			{
				case 'playing':
					// Show the beat cursor
					document.getElementsByClassName('beatCursor').item(0).classList.add('is-visible');
					this.alphatab.play();
					break;

				case 'paused':
					this.alphatab.pause();
					break;

				case 'stopped':
					// Hide the beat cursor
					document.getElementsByClassName('beatCursor').item(0).classList.remove('is-visible');
					this.alphatab.stop();
					break;
			}
		},
		updateVolPlayback()
		{
			this.alphatab.changeTrackVolume(this.alphatab.score.tracks[0], this.volPlayback / 10);
		},
		updateVolMetronome()
		{
			this.alphatab.metronomeValue = this.isMetronomeOn ? this.volMetronome / 10 : 0.0;
		},
		updateLooping()
		{
			this.alphatab.isLooping = this.isLoopingOn;
		},
		loadSoundFont()
		{
			// Don't load the soundfont twice
			if (!this.isPlaybackActive || this.isSoundFontLoaded)
				return;

			this.alphatab.isSoundFontLoaded = true;
			this.alphatab.loadSoundFont(this.soundFontPath);
		}
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>


</style>
<!--}}}-->


<!--{{{ Fixes for the rendering of alphatab -->
<style lang='scss'>

.beatCursor {
	// Align the beat cursor with the score
	transform: translateY(-60px);

	&.is-visible {
		background-color: $color-portage;
	}
}

// Hide the copyright text
.alphaTabSurfaceSvg:last-child { display: none; }

// Hide the bar numbers
.alphaTabSurfaceSvg text[fill="#C80000"] { display: none; }

// Hide the bracket at the beginning of the score
.alphaTabSurfaceSvg > path:last-child,
.alphaTabSurfaceSvg > rect:last-of-type,
.alphaTabSurfaceSvg > path:nth-last-child(2) {
	display: none;
}

// Remove the empty space above the score in page mode
.VAlphatab.is-layout-page .alphaTabSurfaceSvg {
	&:first-child,
	&:nth-child(2) {
		display: none;
	}
}

</style>
<!--}}}-->
