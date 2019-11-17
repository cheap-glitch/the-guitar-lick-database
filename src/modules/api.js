
/**
 * modules/api.js
 */

import axios from 'axios';

export default
{
	call(_method, _url, _callback, _data = {})
	{
		axios({
			url:	_url,
			method: _method,
			data:	_data,

			// Define the API host
			baseURL: 'https://api.tgld.com/',

			// Add the 'X-Requested-With' header to every Axios request
			headers: { common : { 'X-Requested-With': 'XMLHttpRequest' } },
		})
		.then(_response => _callback(_response?.data ?? null))
		.catch(_error	=> console.log(_error));
	},

	get(_url, _callback)
	{
		call('get', _url, _callback);
	},

	post(_url, _data, _callback)
	{
		call('post', _url, _callback, _data);
	},
}
