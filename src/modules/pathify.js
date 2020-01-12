
/**
 * modules/pathify.js
 */

import pathify from 'vuex-pathify'

/**
 * Set custom mappings for Vuex Pathify:
 *
 * getters    foo
 * mutations  setFoo
 * actions    setFooAsync
 */
export default pathify
pathify.options.mapping = function(_type, _name, _format)
{
	switch(_type)
	{
		case 'getters':   return _name;
		case 'mutations': return _format.camel('set', _name);
		case 'actions':   return _format.camel('set', _name, 'async');
	}

	return _name;
}
