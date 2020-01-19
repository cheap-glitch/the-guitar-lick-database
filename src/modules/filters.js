
/**
 * modules/filters.js
 */

function prettifyTypography(_text)
{
	return _text

		// Prettify the note names
		.replace(/([A-G])b\b/g, '$1♭')
		.replace(/([A-G])#/g,   '$1♯')

		// Correct the typography
		.replace(/ (:|\?|!)/g, '$1');
}

function filterExternalLinks(_text)
{
	let link = [];

	while ((link = /<a href="([^"]*)">([^-<]*)-&gt;<\/a>/g.exec(_text)) !== null)
	{
		_text = _text.replace(link[0],
		            `<a href="${link[1]}" target="_blank" rel="external nofollow noopener noreferrer">${link[2]}</a>&nbsp;`
		          + `<fa-icon :icon="['far', 'external-link-square-alt']" />`
		      );
	}

	return _text;
}

module.exports = {
	prettifyTypography,
	filterExternalLinks,
};
