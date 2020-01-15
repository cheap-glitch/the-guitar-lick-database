
/**
 * modules/storage.js
 */

export default
{
	/**
	 * Check if an array contains a value
	 * Return 'false' if the array doesn't exist
	 */
	arrayIncludes(_key, _value)
	{
		return this.get(_key, []).includes(_value);
	},

	/**
	 * Insert a value into an existing array and return the new array
	 * Create a new array if the key isn't present in the storage
	 */
	arrayInsert(_key, _value, _noDuplicates = true)
	{
		let array = this.get(_key, []);

		if (!_noDuplicates || !array.includes(_value))
		{
			array.push(_value);
			this.set(_key, array);
		}

		return array;
	},

	/**
	 * Remove a value from an array and return the new array
	 * If the array doesn't exist, a new empty array is created
	 */
	arrayRemove(_key, _value)
	{
		let array = this.get(_key, []).filter(__v => __v !== _value);
		this.set(_key, array);

		return array;
	},

	/**
	 * Try to get the value associated with a key in the local storage
	 * If the key isn't present or its value is invalid, return a default value
	 */
	get(_key, _defaultValue, _validator = null)
	{
		let value       = localStorage.getItem(`tgld/${_key}`);
		let parsedValue = null;

		if (value === null) return _defaultValue;

		try {
			parsedValue = JSON.parse(value);
		}
		catch (e) {
			// Return the default value if the data is not valid JSON
			return _defaultValue;
		}

		return _validator ? (_validator(parsedValue) ? parsedValue : _defaultValue) : parsedValue;
	},

	/**
	 * Set a value associated with a key
	 * Overwrite the previous value if the key was already present in the storage
	 */
	set(_key, _value)
	{
		localStorage.setItem(`tgld/${_key}`, JSON.stringify(_value));
	},
}
