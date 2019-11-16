
/**
 * model.js
 */

import Data from '@/modules/data';
import Note from '@/modules/note';

export default
{
	/**
	 * Generate the notes of a scale/arpeggio based on a model and a tonality
	 */
	generateNotes(_model, _tonality)
	{
		let notes     = [_tonality];
		let offset    = Data.notes.indexOf(_tonality);
		let intervals = _model;

		for (let i=0; i<intervals.length - 1; i++)
		{
			offset += intervals[i];
			notes.push(Data.notes[offset % 12]);
		}

		return notes;
	},
}
