
/**
 * modules/alphatex.js
 */

/**
 * Return a list of all the frets used in a lick
 */
export function getFretList(tex)
{
	return [...new Set(
		getTexElements(tex)
			.reduce(function (frets, elem)
			{
				// The element is a regular note if it starts
				// with a fret number and has at least one dot
				if (/^\d\d?\./.test(elem))
					frets.push(parseInt(elem.split('.')[0]));

				return frets;
			},
			[])
	)];
}

/**
 * Transpose every note in an alphatex score
 * If a string number is specified, only transpose the notes on that string
 */
export function transposeTex(tex, shift, string = null)
{
	return getTexElements(tex)
		.map(function (elem)
		{
			// Ignore all elements that aren't actual notes
			if (!/^\d\d?\./.test(elem)) return elem;

			// Split the element into its parts (fret, string, [effects, duration])
			let parts = elem.split('.');

			// Ignore duration on note effects
			if (parts[0].includes('}'))
				return elem;

			// Increment the fret number
			if (string === null || parseInt(parts[1][0]) == string)
				parts[0] = parseInt(parts[0]) + shift;

			return parts.join('.');
		})
		.join(' ')
		.replace(/\( /g, '(');
}

/**
 * Return all the elements of an alphatex score in an array
 * The alphatex must be expanded first
 */
export function getTexElements(tex)
{
	return tex.trim()

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
export function expandTex(rawTex)
{
	let tex = rawTex.trim();

	// Replace every '%' with the content between the straight brackets
	const expr = tex.match(/\[(.*)\]/);
	if (expr !== null) tex = tex.replace(/%/g, expr[1]);
	tex = tex.replace(/(\[|\])/g, '');

	// Tuplets
	tex = tex.replace(/\/\//g, '{tu 6}');
	tex = tex.replace(/\//g,   '{tu 3}');

	// Hammer-ons & pull-offs
	tex = tex.replace(/\^/g, '{h}');

	// Slides
	tex = tex.replace(/--/g, '{ss}');

	// Vibrato
	tex = tex.replace(/~/g, '{v}');

	// Bends
	tex = tex.replace(/fbr/g,  'b (0 4 0)');
	tex = tex.replace(/hbr/g,  'b (0 2 0)');
	tex = tex.replace(/rb/g,   'b (4 0)');
	tex = tex.replace(/rhb/g,  'b (2 0)');
	tex = tex.replace(/pb/g,   'b (4 4)');
	tex = tex.replace(/fb/g,   'b (0 4)');
	tex = tex.replace(/hb/g,   'b (0 2)');
	tex = tex.replace(/qb/g,   'b (0 1)');

	// Picking strokes
	tex = tex.replace(/↑/g, '{su}');
	tex = tex.replace(/↓/g, '{sd}');

	// Combine effects properly
	tex = tex.replace(/}{/g, ' ');

	return tex;
}
