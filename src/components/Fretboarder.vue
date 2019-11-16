

<!-- Fretboarder.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.Fretboarder

	//----------------------------------------------------------------------
	//- Tools & options
	//----------------------------------------------------------------------
	div.toolbar
		div.options
			//- Instrument
			select(v-model="instrumentModel")
				option(
					v-for="(item, key) in instruments"
					:key="key"
					:value="key"
					) {{ item.name }}
			//- Tuning
			select(v-model="tuningModel")
				option(
					v-for="(item, key) in tunings[instrument]"
					:key="key"
					:value="key"
					) {{ tuningsNames[key] }}
			//- Fret range
			div.frets-slider
				vue-slider(
					v-model="fretRangeModel"
					:min="0"
					:max="24"
					:min-range="4"
					:interval="1"
					:direction="fretboardFlipped ? 'rtl' : 'ltr'"
					tooltip="always"
					:tooltip-formatter="tooltipFormatter"
					adsorb
					lazy
					)
		div.tools
			//- Toggle note names
			fa-icon.button.tool(
				:icon="['far', 'info-circle']"
				title="Toggle note names"
				:class="{ 'is-active': isDisplayingNotesName }"
				@click.left="toggleIsDisplayingNotesName"
				)
			//- Switch fretting hand
			fa-icon.button.tool(
				:icon="['far', 'hand-paper']"
				:[flipHandIcon]="'horizontal'"
				title="Switch fretting hand"
				@click.left="$store.commit('fretboarder/toggleFretboardFlip')"
				)
			//- Clear the fretboard
			fa-icon.button.tool(
				:icon="['far', 'eraser']"
				title="Clear the freatboard"
				@click.left="scales = []; nextScaleID = 0"
				)
			//- Export the fretboard
			div#canvas-wrapper
			v-popover
				fa-icon.tool.button(
					:icon="['far', 'file-download']"
					title="Export the fretboard image"
					)
				template(slot="popover")
					div.export-menu
						div.button-text: p(v-close-popover @click.left="exportToFile('png')") PNG
						div.button-text: p(v-close-popover @click.left="exportToFile('jpg')") JPG
						div.button-text: p(v-close-popover @click.left="exportToFile('svg')") SVG
						div.button-text: p(v-close-popover @click.left="exportToFile('pdf')") PDF

	//----------------------------------------------------------------------
	//- Fretboard
	//----------------------------------------------------------------------
	FretboardViewer(
		mode="scale"
		layout="horizontal"
		:nb-strings="nbStrings"
		:fret-range="fretRange"
		:tuning="tunings[instrument][tuning]"
		:notes-sequences="activeScales"
		:displayed-info="isDisplayingNotesName ? 'name' : 'none'"
		is-displaying-inlays
		is-imitating-real-fret-spacing
		)

	//----------------------------------------------------------------------
	//- Scales & arpeggios
	//----------------------------------------------------------------------
	div.scales
		FretboarderScale(
			v-for="scale in scales"
			:key="scale.id"
			v-bind.sync="scale"
			@focus-scale="focusScale"
			@remove-scale="removeScale"
			)
		fa-icon.button.tool(
			:icon="['far', 'plus-circle']"
			title="Add a new scale of arpeggio"
			@click.left="addScale"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapState }	from 'vuex';
import { saveAs }	from 'file-saver';

import Str		from '@/modules/string';
import Data		from '@/modules/data';
import Model		from '@/modules/model';
import Storage		from '@/modules/storage';
import FretboardViewer	from '@/components/FretboardViewer';
import FretboarderScale from '@/components/FretboarderScale';
import {
	exportSVGToPDF,
	exportSVGToImage,
	exportFretboardToSVG,
} from '@/modules/export';

export default {
	name: 'Fretboarder',

	components: {
		FretboardViewer,
		FretboarderScale,
	},

	static() {
		return {
			tunings:	Data.tuningsFretboarder,
			instruments:	Data.instruments,
			tuningsNames:	Data.tuningsNames,
			scaleColors:    [
				'steelblue',
				'mediumseagreen',
				'yellowgreen',
				'orange',
				'#cb4b16',
			],
		}
	},

	data() {
		return {
			instrument:	Storage.get('instrument', 'guitar'),
			tuning:		Storage.get('tuning',	  'standard'),
			fretRange:	Storage.get('fretRange',  [0, 22]),
			scales:		[{
						id: 0,
						type: 'scale',
						model: 'min',
						tonality: 'B',
						isVisible: true,
					}],
			nextScaleID:	1,

			isDisplayingNotesName: Storage.get('isDisplayingNotesName', true),

			tooltipFormatter: _v => ((_v == 0) ? 'Open strings' : `${Str.addCounterSuffix(_v)} fret`),
		}
	},

	computed: {
		instrumentModel:
		{
			set(_v)
			{
				// Reset the tuning to default when switching between different instruments
				this.tuning	= 'standard';
				this.instrument = _v;

				Storage.set('tuning',	  'standard');
				Storage.set('instrument', _v);
			},
			get() { return this.instrument; }
		},
		tuningModel:
		{
			set(_v)
			{
				this.tuning = _v;
				Storage.set('tuning', _v);
			},
			get() { return this.tuning; }
		},
		fretRangeModel:
		{
			set(_v)
			{
				this.fretRange = _v;
				Storage.set('fretRange', _v);
			},
			get() { return this.fretRange; }
		},
		nbStrings()
		{
			return this.instruments[this.instrument].nbStrings;
		},
		flipHandIcon()
		{
			return !this.fretboardFlipped ? 'flip' : null;
		},
		activeScales()
		{
			return this.scales.filter(_scale => _scale.isVisible).map(
				_scale => ({
					notes:	  Model.generateNotes(Data[`${_scale.type}s`][_scale.model].model, _scale.tonality),
					color:	  this.scaleColors[_scale.id % this.scaleColors.length],
					tonality: _scale.tonality,
				}));
		},

		...mapState('fretboarder', [
			'fretboardFlipped',
		]),
	},

	methods: {
		addScale()
		{
			this.scales.push({
				id:	    this.nextScaleID,
				type:	    'scale',
				model:	    'maj',
				tonality:   'A',
				isVisible:  true,
			});
			this.nextScaleID++;
		},
		removeScale(_id)
		{
			this.scales = this.scales.filter(_item => _item.id !== _id);
		},
		focusScale(_id)
		{
			this.scales.forEach(_scale => _scale.isVisible = (_scale.id == _id) ? true : false);
		},
		toggleIsDisplayingNotesName()
		{
			this.isDisplayingNotesName = !this.isDisplayingNotesName;
			Storage.set('isDisplayingNotesName', this.isDisplayingNotesName);
		},
		exportToFile(_format)
		{
			const svg = exportFretboardToSVG(
				this.nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				this.tunings[this.instrument][this.tuning],
				this.activeScales,
				this.fretboardFlipped,
				true,
				_format != 'svg',
			);

			switch (_format)
			{
				case 'png':
				case 'jpg':
					exportSVGToImage(svg, _format);
					break;

				case 'svg':
					saveAs(svg.blob, 'fretboard.svg');
					break;

				case 'pdf':
					exportSVGToPDF(svg);
					break;
			}
		}
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.toolbar {
	display: flex;
	justify-content: space-between;

	margin-bottom: 40px;
}

.options {
	display: flex;
	align-items: flex-end;
	@include space-children-h(10px);
}

.frets-slider {
	width: 350px;

	margin-left: 20px;
}

.tools {
	display: flex;
	align-items: center;
	@include space-children-h(15px);
}

.tool {
	font-size: 30px;
}

.export-menu {
	display: grid;
	grid-template-rows: 1fr 1fr;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;

	padding: 5px;
}

#canvas-export,
#canvas-wrapper {
	display: none;
}

.scales {
	display: flex;
	align-items: center;
	flex-direction: column;
	@include space-children-v(10px);

	margin-top: 40px;
}

</style>
<!--}}}-->


<!--{{{ Styling for components -->
<style lang='scss'>

// Load the styles for the slider & set the theme color
$themeColor: steelblue;
@import '~vue-slider-component/lib/theme/default';

// Load the styles for the buttons and popovers
@import '@/styles/fretboarder';

</style>
<!--}}}-->
