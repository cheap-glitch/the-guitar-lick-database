
/**
 * modules/api.js
 */

import axios                        from 'axios'
import { isEmpty as isEmptyObject } from '@/modules/object'

export default
{
	get(url, callback)
	{
		this.xhr('get', url, callback);
	},

	post(url, data, callback)
	{
		this.xhr('post', url, callback, data);
	},

	put(url, data, callback)
	{
		this.xhr('put', url, callback, data);
	},

	xhr(method, url, callback, data = {})
	{
		const headers = {
			common : { 'X-Requested-With': 'XMLHttpRequest' }
		};

		if (!isEmptyObject(data))
			headers.common['Content-Type'] = 'application/json';

		axios({
			url:      url,
			baseURL:  process.env.VUE_APP_API_HOST,

			method:   method,
			data:     data,

			headers,
		})
		.then(response => callback(response?.data ?? null))
		.catch(error   => { if (process.env.NODE_ENV == 'development') console.error(error) });
	},
}
