
/**
 * modules/object.js
 */

/**
 * Filter an object and return the filtered copy
 */
export function filter(object, callback)
{
	return Object.keys(object).reduce(
		function(result, key)
		{
			if (callback(key, object[key]))
				result[key] = object[key];

			return result;
		}, {});
}

/**
 * Map a function on an object and return the resulting object with corresponding keys
 */
export function mapToObject(object, callback)
{
	return Object.keys(object).reduce(
		function(result, key)
		{
			result[key] = callback(key, object[key])

			return result;
		}, {});
}

/**
 * Map a function on an object and return the resulting array
 */
export function map(object, callback)
{
	return Object.keys(object).map(key => callback(key, object[key]));
}

/**
 * Apply a function to every key/value pair of an object
 */
export function forEach(object, callback)
{
	Object.keys(object).forEach(key => callback(key, object[key]));
}

/**
 * Return the key if it's in the object, otherwise return 'null'
 */
export function checkKey(object, key)
{
	return (key in object) ? key : null;
}

/**
 * Check if an object is empty (i.e. has no keys)
 */
export function isEmpty(object)
{
	return (Object.keys(object).length == 0);
}

/**
 * Check if a value is an object
 */
export function isObject(value)
{
	return (value !== null && Object.prototype.toString.call(value) == '[object Object]');
}
