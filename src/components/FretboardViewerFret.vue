

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardViewerFret.fret(
	:class="[`is-${layout}`, { 'is-flipped': fretboardFlipped, 'is-open-string': (fret == 0) }]"
	:style="[height, fretPosition, borders]"
	)
	div.fret__inlay(v-show="isDisplayingInlay")
	div.fret__note(
		:class="{ 'is-active': isActive, 'is-open-string': (fret == 0), 'is-on-last-string': isOnLastString }"
		:style="notePosition"
		)
		div.fret__note__filling(
			v-for="(layer, index) in layers"
			:key="index"
			:style="{ 'background-color': layer.color }"
			)
		p.fret__note__info(v-show="isActive && displayedInfo != 'none'") {{ noteInfo }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapState } from 'vuex';

import Str  from '@/modules/string';
import Obj  from '@/modules/object';
import Data from '@/modules/data';
import Note from '@/modules/note';

export default {
	name: 'FretboardViewerFret',

	props: {
		layout: {
			type: String,
			default: 'vertical',
			validator: _v => ['vertical', 'horizontal'].includes(_v)
		},
		string: {
			type: Number,
			required: true,
		},
		nbStrings: {
			type: Number,
			required: true,
		},
		fret: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			default: 'A',
			validator: _v => Data.notes.includes(_v)
		},
		interval: {
			type: Number,
			default: 0,
		},
		notesSequences: {
			type: Array,
			default: [],
		},
		displayedInfo: {
			type: String,
			default: 'none',
			validator: _v => ['none', 'name', 'degree'].includes(_v)
		},
		isDisplayingInlay: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		layers()
		{
			return this.notesSequences.filter(_seq => _seq.notes.includes(this.note));
		},
		isActive()
		{
			return this.layers.length > 0;
		},
		isOnLastString()
		{
			return (this.layout == 'horizontal' && this.string == 0)
			    || (this.layout == 'vertical'   && this.string == (() => this.fretboardFlipped ? 0 : this.nbStrings - 1)());
		},
		height()
		{
			return Obj.filter(
				{
					// Add some padding to spread the strings
					padding: !this.isOnLastString ? ((this.layout == 'horizontal') ? '10px 0' : '0 10px') : null,

					// Don't take any vertical space for the frets of the bottom/rightmost string
					width:  (this.isOnLastString && this.layout == 'vertical')   ? 0 : null,
					height: (this.isOnLastString && this.layout == 'horizontal') ? 0 : null,
				},
				(_k, _v) => _v !== null
			);

		},
		fretPosition()
		{
			// If the fretboard is vertical, force the positioning of the fret
			return (this.layout != 'vertical') ? {} : {
				'grid-row':    this.fret   + 1,
				'grid-column': (this.fretboardFlipped ? this.nbStrings - this.string : this.string) + 1,
			};
		},
		notePosition()
		{
			let translate = (this.layout == 'horizontal') ? 'translateY' : 'translateX';

			// Translate the note to put center it on the string
			return { transform: `${translate}(${this.isOnLastString ? '-50%' : 'calc(-50% - 10px)'})` };
		},
		noteInfo()
		{
			switch (this.displayedInfo)
			{
				case 'name':   return Note.prettifyName(this.note);
				case 'degree': return `${this.interval}`;
			}
		},
		borders()
		{
			// Don't display any borders for the notes of the open strings
			if (this.fret == 0) return {};

			let borders = {};
			let flipped = this.fretboardFlipped;

			switch (this.layout)
			{
				case 'vertical':
					borders['border-left'] = 'solid black 2px';
					if (!this.isOnLastString)
					{
						borders['border-bottom'] = 'solid gray 2px';
						if (this.fret == 1)
							borders['border-top'] = 'solid black 5px';
					}

					break;

				case 'horizontal':
					borders['border-top'] = 'solid black 2px';
					if (!this.isOnLastString)
					{
						borders[flipped ? 'border-left' : 'border-right'] = 'solid gray 2px';
						if (this.fret == 1)
							borders[flipped ? 'border-right' : 'border-left'] = 'solid black 5px';
					}

					break;
			}

			return borders;
		},

		...mapState('fretboarder', [
			'fretboardFlipped',
		]),
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.FretboardViewerFret {
	display: flex;

	position: relative;

	&.is-vertical   { align-items: center;     }
	&.is-horizontal { justify-content: center; }

	&.is-horizontal.is-open-string		  { justify-content: flex-start; }
	&.is-horizontal.is-open-string.is-flipped { justify-content: flex-end;   }
}

.fret__note {
	display: flex;
	overflow: hidden;

	position: relative;
	@include circle(30px);

	&.is-on-last-string {
		position: absolute;
	}

	// Display a dotted border around unactive open string notes
	&.is-open-string:not(.is-active) {
		border: dashed lightgray 2px;
	}
}

.fret__note__filling {
	flex: 1 1 100%;
}

.fret__note__info {
	@include center-position;

	font-weight: bold;

	color: white;
}

.fret__inlay {
	@include center-position;
	@include circle(20px);

	background-color: lightgray;
}

</style>
<!--}}}-->
