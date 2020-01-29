
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
pathify.options.mapping = function(type, name, format)
{
	switch(type)
	{
		case 'getters':   return name;
		case 'mutations': return format.camel('set', name);
		case 'actions':   return format.camel('set', name, 'async');
	}

	return name;
}
export default pathify;
