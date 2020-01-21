
/**
 * stores/progressbar.js
 */

export default
{
	namespaced: true,

	state: {
		isLoading: true,
	},

	mutations: {
		start: state => state.isLoading = true,
		stop:  state => state.isLoading = false,
	},

	actions: {
		stop(context)
		{
			setTimeout(() => context.commit('stop'), 500);
		},
	},
}
