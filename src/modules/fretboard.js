
/**
 * fretboard.js
 */

import Note from '@/modules/note';

export default
{
	/**
	 * Return a matrix representing the state of each fret on the fretboard
	 * Each string can only bear one active fret, and every note from the chord must be present at least once on the whole fretboard
	 */
	generateFromChord(_nbStrings, _tuning, _notes)
	{
		let strings = [];

		for (let i=0; i<_nbStrings; i++)
		{
			// Get the notes of each string based on the tuning
			let stringNotes = this.getStringNotes(_tuning[i]);

			// For each fret, check if its note is in the list
			for (let j=0, hasActiveNote=false, notes=[]; j<=24; j++)
			{
				// If the string doesn't already have an active note
				if (!hasActiveNote && _notes.includes(stringNotes[j]))
				{
					hasActiveNote = true;
					notes.push([true]);
					continue;
				}

				notes.push([false]);
			}

			strings.push(notes);
		}

		return strings;
	},

	/**
	 * Return an array containing all the notes of a string
	 */
	getStringNotes(_openStringNote)
	{
		let notes = [];

		for (let i=0; i<=24; i++)
			notes.push(Note.getIntervalNote(_openStringNote, i));

		return notes;
	}
}
