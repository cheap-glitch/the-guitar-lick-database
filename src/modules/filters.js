
/**
 * modules/filters.js
 */

function filterExternalLinks(_text)
{
	let link = [];
	const matchExtLinks = /<a href="([^"]*)">([^-<]*)-&gt;<\/a>/g;

	while ((link = matchExtLinks.exec(_text)) !== null)
	{
		_text = _text.replace(link[0],
		  `<a href="${link[1]}" target="_blank" rel="external nofollow noopener noreferrer">${link[2]}</a>&nbsp;`
		+ `<fa-icon :icon="['far', 'external-link-square-alt']" />`
		);
	}

	return _text;
}

module.exports = {
	filterExternalLinks,
};
