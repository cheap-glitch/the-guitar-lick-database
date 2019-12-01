
/**
 * modules/tools.js
 */

export function inBounds(_val, _min, _max)
{
	return !Number.isNaN(_val) && (_min <= _val && _val <= _max);
}
