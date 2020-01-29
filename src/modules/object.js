
/**
 * modules/object.js
 */

/**
 * Filter an object and return the filtered copy
 */
export function objectFilter(object, callback)
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
export function objectMapToObject(object, callback)
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
export function objectMap(object, callback)
{
	return Object.keys(object).map(key => callback(key, object[key]));
}

/**
 * Apply a function to every key/value pair of an object
 */
export function objectForEach(object, callback)
{
	Object.keys(object).forEach(key => callback(key, object[key]));
}

export function isEmptyObject(object)
{
	return (Object.keys(object).length == 0);
}

export function isObject(value)
{
	return (value !== null && Object.prototype.toString.call(value) == '[object Object]');
}
