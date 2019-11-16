
/**
 * modules/object.js
 */

export default
{
	/**
	 * Filter an object and return the filtered copy
	 */
	filter(_object, _callback)
	{
		return Object.keys(_object).reduce(
			function(__result, __key)
			{
				if (_callback(__key, _object[__key]))
					__result[__key] = _object[__key];

				return __result;
			}, {});
	},

	/**
	 * Map a function on an object and return the resulting object with corresponding keys
	 */
	mapToObject(_object, _callback)
	{
		return Object.keys(_object).reduce(
			function(__result, __key)
			{
				__result[__key] = _callback(__key, _object[__key])

				return __result;
			}, {});
	},

	/**
	 * Map a function on an object and return the resulting array
	 */
	map(_object, _callback)
	{
		return Object.keys(_object).map(__key => _callback(__key, _object[__key]));
	},

	/**
	 * Check if a key exists in an object, that its value is not null and not empty,
	 * and that it belongs to a list of permitted values -- if not, return the provided default instead
	 */
	check(_object, _key, _permittedValues, _defaultValue)
	{
		const value	      = _object?.[_key] ?? _defaultValue;
		const permittedValues = this.isObject(_permittedValues) ? Object.keys(_permittedValues) : _permittedValues;

		return permittedValues.includes(value) ? value : _defaultValue;
	},

	isEmpty(_object)
	{
		return (Object.keys(_object).length == 0);
	},

	isObject(_value)
	{
		return (Object.prototype.toString.call(_value) === '[object Object]');
	},
}
