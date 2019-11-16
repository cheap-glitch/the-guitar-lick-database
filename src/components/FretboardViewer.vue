

<!-- FretboardViewer.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardViewer(:style="[grid, inlays]")
	FretboardViewerFret(
		v-for="fret in frets"
		v-bind="fret"
		:key="`${fret.fret}-${fret.string+1}`"
		:layout="layout"
		:notes-sequences="notesSequences"
		:displayed-info="displayedInfo"
		:is-displaying-inlay="isDisplayingInlays && inlays.indexOf(fret.fret + '-' + fret.string) != -1"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapState } from 'vuex';

import Data		   from '@/modules/data';
import Fretboard	   from '@/modules/fretboard';
import FretboardViewerFret from '@/components/FretboardViewerFret';

export default {
	name: 'FretboardViewer',

	components: {
		FretboardViewerFret,
	},

	props: {
		mode: {
			type: String,
			required: true,
			validator: _v => ['chord', 'scale'].includes(_v)
		},
		layout: {
			type: String,
			required: true,
			validator: _v => ['vertical', 'horizontal'].includes(_v)
		},
		nbStrings: {
			type: Number,
			default: 6,
		},
		fretRange: {
			type: Array,
			required: true,
		},
		tuning: {
			type: Array,
			default: () => Data.tunings.guitar['standard'],
		},
		notesSequences: {
			type: Array,
			default: () => [],
		},
		displayedInfo: {
			type: String,
			default: 'none',
			validator: _v => ['none', 'name', 'degree'].includes(_v)
		},
		isDisplayingInlays: {
			type: Boolean,
			default: false,
		},
		isImitatingRealFretSpacing: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		fretMin()
		{
			return this.fretRange[0];
		},
		fretMax()
		{
			return this.fretRange[1];
		},
		nbFrets()
		{
			return this.fretMax - this.fretMin + 1;
		},
		frets()
		{
			let frets = [];

			// Generate a list of frets
			for (let i=0; i<this.nbStrings; i++)
			{
				// Invert the order of the strings if the layout is horizontal of if it's vertical but flipped
				let string = (this.layout == 'horizontal' || (this.layout == 'vertical' && this.fretboardFlipped))
					   ? this.nbStrings - 1 - i
					   : i;

				// Get all the notes of the string according to the current tuning
				let stringNotes = Fretboard.getStringNotes(this.tuning[string]);

				for (let j=this.fretMin; j<=this.fretMax; j++)
				{
					// Invert the order of the frets if the horizontal fretboard is flipped
					let fret = (this.fretboardFlipped && this.layout == 'horizontal')
						 ? this.fretMin + this.fretMax - j
						 : j;

					frets.push({ string, fret, nbStrings: this.nbStrings, note: stringNotes[fret] });
				}
			}

			return frets;
		},
		grid()
		{
			let layout;
			let openStringFretsSize = '45px';

			// Simple layout (all the spaces between the frets have the same size)
			if (!this.isImitatingRealFretSpacing)
			{
				layout = `${openStringFretsSize} repeat(${this.nbFrets - 1}, 1fr)`;
			}
			// "Realistic" layout : the spaces between the frets grow shorter when moving upwards on the neck
			else
			{
				/**
				 * Compute the size of each fret so that:
				 *	- f(1) = 3/2
				 *	- f(n) = 1/2 (n = total number of frets)
				 *
				 * Which gives the following function:
				 *	f(x) = (3n - 1)/(2n - 2) - x/(n - 1)
				 */
				let fretSizes = [];
				for (let i=0, n=this.nbFrets; i<this.nbFrets; i++)
					fretSizes.push((i + this.fretMin == 0)
						? openStringFretsSize
						: ((3*n - 1)/(2*n - 2) - i/(n - 1)) + 'fr');

				layout = (() => (this.fretboardFlipped && this.layout == 'horizontal')
						? fretSizes.reverse()
						: fretSizes)().join(' ');
			}

			// Return the template for the grid
			switch (this.layout)
			{
				case 'vertical':   return { 'grid-template-rows':    layout };
				case 'horizontal': return { 'grid-template-columns': layout };
			}
		},
		inlays()
		{
			// List the frets which bear an inlay (only the 12th is omitted)
			let frets = ['3', '5', '7', '9', '15', '17', '19', '21'];

			switch (this.nbStrings)
			{
				/**
				 * Bass & ukulele, guitar
				 * Single inlay in the middle + double inlay at the 12th fret
				 */
				case 4:  return ['12-1', '12-3'].concat(frets.map(_f => `${_f}-2`));
				case 6:  return ['12-2', '12-4'].concat(frets.map(_f => `${_f}-3`));

				/**
				 * Five-string banjo, seven-string guitar, mandolin, nine-, eleven- string guitar
				 * Double inlay (close for odd frets, spreaded for the 12th)
				 */
				case 5:  return ['12-1', '12-4'].concat(frets.map(_f => `${_f}-2`), frets.map(_f => `${_f}-3`));
				case 7:  return ['12-2', '12-5'].concat(frets.map(_f => `${_f}-3`), frets.map(_f => `${_f}-4`));
				case 8:  return ['12-2', '12-6'].concat(frets.map(_f => `${_f}-3`), frets.map(_f => `${_f}-5`));
				case 9:  return ['12-2', '12-7'].concat(frets.map(_f => `${_f}-3`), frets.map(_f => `${_f}-6`));
				case 11: return ['12-3', '12-8'].concat(frets.map(_f => `${_f}-4`), frets.map(_f => `${_f}-7`));

				/**
				 * Tenn-string guitar
				 * Double inlay for odd frets, triple for the 12th
				 */
				case 10: return ['12-2', '12-8'].concat(frets.map(_f => `${_f}-4`), frets.map(_f => `${_f}-6`), ['12-5']);

				default: return [];
			}
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

.FretboardViewer {
	display: grid;
}

</style>
<!--}}}-->
