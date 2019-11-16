
/**
 * modules/api.js
 */

import axios from 'axios';

const axiosConfig = {

	// Define the API host
	baseURL: 'https://api.tgld.com/',

	// Add the 'X-Requested-With' header to every Axios request
	headers: { common : { 'X-Requested-With': 'XMLHttpRequest' } },
};

// Useful wrapper around Axios
export default
{
	get(_url, _callback)
	{
		axios.get(_url, axiosConfig)
			.then(_response => _callback(_response))
			.catch(_error	=> console.log(_error));
	},

	post(_url, _data, _callback)
	{
		axios.post(_url, _data, axiosConfig)
			.then(_response => _callback(_response))
			.catch(_error	=> console.log(_error));
	},

	put(_url, _data, _callback)
	{
		axios.put(_url, _data, axiosConfig)
			.then(_response => _callback(_response))
			.catch(_error	=> console.log(_error));
	},
}
