
/**
 * modules/alphatex.js
 */

/**
 * Return a list of all the frets used in a lick
 */
export function getFretList(_tex)
{
	return [...new Set(
		getTexElements(_tex)
			.reduce(function (_frets, _elem)
			{
				// The element is a regular note if it starts
				// with a fret number and has at least one dot
				if (/^\d\d?\./.test(_elem))
					_frets.push(parseInt(_elem.split('.')[0]));

				return _frets;
			},
			[])
	)];
}

/**
 * Transpose every note in an alphatex score
 * If '_string' is set, transpose only the notes on the corresponding string
 */
export function transposeTex(_tex, _shift, _string = null)
{
	return getTexElements(_tex)
		.map(function (_elem)
		{
			// Ignore all elements that aren't actual notes
			if (!/^\d\d?\./.test(_elem)) return _elem;

			// Split the element into its parts (fret, string, [effects, duration])
			let parts = _elem.split('.');

			// Ignore duration on note effects
			if (parts[0].includes('}'))
				return _elem;

			// Increment the fret number
			if (_string === null || parseInt(parts[1][0]) == _string)
				parts[0] = parseInt(parts[0]) + _shift;

			return parts.join('.');
		})
		.join(' ')
		.replace(/\( /g, '(');
}

/**
 * Return all the elements of an alphatex score in an array
 * The alphatex must be expanded first
 */
export function getTexElements(_tex)
{
	return _tex.trim()

		// Add spaces after opening parentheses (denoting grouped notes on a single beat)
		.replace(/\(/g, '( ')

		// Remove consecutive spaces
		.replace(/\s\s+/g, ' ')

		// Split the score into single elements
		.split(' ');
}

/**
 * Expand the shorthands inside an alphatex score
 */
export function expandTex(_tex)
{
	let tex = _tex.trim();

	// Replace every '%' with the content between the straight brackets
	const expr = tex.match(/\[(.*)\]/);
	if (expr != null) tex = tex.replace(/%/g, expr[1]);
	tex = tex.replace(/(\[|\])/g,	'');

	// Tuplets
	tex = tex.replace(/\/\//g,	'{tu 6}');
	tex = tex.replace(/\//g,	'{tu 3}');

	// Hammer-ons & pull-offs
	tex = tex.replace(/\^/g,	'{h}');

	// Slides
	tex = tex.replace(/--/g,	'{ss}');

	// Vibrato
	tex = tex.replace(/~/g,		'{v}');

	// Bends
	tex = tex.replace(/fbr/g,	'b (0 4 0)');
	tex = tex.replace(/hbr/g,	'b (0 2 0)');
	tex = tex.replace(/rb/g,	'b (4 0)');
	tex = tex.replace(/rhb/g,	'b (2 0)');
	tex = tex.replace(/pb/g,	'b (4 4)');
	tex = tex.replace(/fb/g,	'b (0 4)');
	tex = tex.replace(/hb/g,	'b (0 2)');
	tex = tex.replace(/qb/g,	'b (0 1)');

	// Picking strokes
	tex = tex.replace(/↑/g,		'{su}');
	tex = tex.replace(/↓/g,		'{sd}');

	// Combine effects properly
	tex = tex.replace(/}{/g,	' ');

	return tex;
}
