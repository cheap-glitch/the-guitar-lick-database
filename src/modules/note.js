
/**
 * note.js
 */

import Str  from '@/modules/string';
import Data from '@/modules/data';

export default
{
	/**
	 * Return the second note of an interval expressed in half-steps
	 */
	getIntervalNote(_root, _interval)
	{
		let index   = Data.notes.indexOf(_root) + _interval;
		let nbNotes = Data.notes.length;

		return Data.notes[(index < 0) ? (index + nbNotes*Math.ceil(Math.abs(index)/nbNotes)) : (index % nbNotes)];
	},

	/**
	 * Return the name of the note or a synonym that is present in the Data.notes array
	 */
	getTrueName(_name)
	{
		let name = Str.firstCharToUpperCase(_name);

		// If an accidental note isn't found in Data.notes, change it into it's unaltered equivalent
		if (Data.notes.indexOf(name) == -1)
		{
			// Find the index of the note without any accidentals
			let index = Data.notes.indexOf(name[0]);

			// Invalid name
			if (index == -1) return null;

			// Flattened notes
			if (name != 'Bb' && Str.str(name, 'b'))
			{
				// Return the name of the note one half-step lower
				return Data.notes[(index == 0) ? Data.notes.length - 1 : index - 1];
			}

			// Sharpened notes
			if (name == 'A#') return 'Bb';
			if (name == 'B#') return 'C';
			if (name == 'E#') return 'F';

			// Unknown note
			return null;
		}

		return name;
	},

	/**
	 * Return the name of a note/chord/arpeggio/etc. with a pretty typography
	 */
	prettifyName(_name)
	{
		return Str.firstCharToUpperCase(_name).replace(/b/, '♭').replace(/#/, '♯');
	},

	/**
	 * Return the name of a note/chord/arpeggio/etc. that's usable in code
	 */
	uglifyName(_name)
	{
		return _name.replace(/♭/, 'b').replace(/♯/, '#');
	},
}
