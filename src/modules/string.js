
/**
 * string.js
 */

export default
{
	/**
	 * Return a numeral suffixed with the appropriate counter
	 */
	addCounterSuffix(_number)
	{
		if (11 <= _number && _number <= 13) return `${_number}th`;

		switch (('' + _number).slice(-1))
		{
			case '1': return `${_number}st`;
			case '2': return `${_number}nd`;
			case '3': return `${_number}rd`;
			default:  return `${_number}th`;
		}
	},

	/**
	 * Return a string with its first character uppercase
	 */
	firstCharToUpperCase: _str => _str[0].toUpperCase() + _str.slice(1),
}
