
/**
 * modules/music.js
 */

import data from '@/modules/data'

/**
 * Return the second note of an interval expressed in half-steps
 */
export function getIntervalNote(_root, _interval)
{
	let index   = data.notes.indexOf(_root) + _interval;
	let nbNotes = data.notes.length;

	return data.notes[(index < 0) ? (index + nbNotes*Math.ceil(Math.abs(index)/nbNotes)) : (index % nbNotes)];
}
