
/**
 * modules/api.js
 */

import axios             from 'axios'
import { isEmptyObject } from '@/modules/object'

export default
{
	get(_url, _defaultValue, _callback)
	{
		this.xhr('get', _url, _callback, {}, _defaultValue);
	},

	post(_url, _data, _callback)
	{
		this.xhr('post', _url, _callback, _data);
	},

	put(_url, _data, _callback)
	{
		this.xhr('put', _url, _callback, _data);
	},

	xhr(_method, _url, _callback, _data = {}, _defaultValue = null)
	{
		const headers = {
			common : { 'X-Requested-With': 'XMLHttpRequest' }
		};

		if (!isEmptyObject(_data))
			headers.common['Content-Type'] = 'application/json';

		axios({
			url:      _url,
			baseURL:  process.env.VUE_APP_API_HOST,

			method:   _method,
			data:     _data,

			headers,
		})
		.then(_response => _callback(_response?.data ?? _defaultValue))
		.catch(_error   => { if (process.env.NODE_ENV == 'development') console.log(_error) });
	},
}
