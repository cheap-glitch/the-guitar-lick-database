
/**
 * modules/api.js
 */

import axios from 'axios';

export default
{
	xhr(_method, _url, _callback, _data = {})
	{
		axios({
			url:	_url,
			method: _method,
			data:	_data,

			// Define the API host
			baseURL: process.env.VUE_APP_API_HOST,

			// Add the 'X-Requested-With' header to every Axios request
			headers: { common : { 'X-Requested-With': 'XMLHttpRequest' } },
		})
		.then(_response => _callback(_response?.data ?? null))
		.catch(_error	=> console.log(_error));
	},

	get(_url, _callback)
	{
		this.xhr('get', _url, _callback);
	},

	post(_url, _data, _callback)
	{
		this.xhr('post', _url, _callback, _data);
	},
}
