
/**
 * modules/tools.js
 */

export function inBounds(val, min, max)
{
	return !Number.isNaN(val) && (min <= val && val <= max);
}
