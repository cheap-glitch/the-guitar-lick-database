
/**
 * stores/progressbar.js
 */

export default
{
	namespaced: true,

	state: {
		percent: 0,
	},

	mutations: {
		start: state => state.percent =   0,
		stop:  state => state.percent = 100,
	},
}
