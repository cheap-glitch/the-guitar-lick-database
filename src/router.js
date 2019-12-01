
/**
 * router.js
 */

import Vue    from 'vue';
import Router from 'vue-router';

import store  from '@/stores/main';

/**
 * Routes
 * -----------------------------------------------------------------------------
 */
let routes = [
	{
		path: '/',
		name: 'home',
		components: {
			view:  loadAsyncComponent('HomeView'),
			aside: loadAsyncComponent('HomeAside'),
		}
	},
	{
		path: '/browse',
		name: 'browse',
		components: {
			view:  loadAsyncComponent('BrowseView'),
			aside: loadAsyncComponent('BrowseAside'),
		}
	},
	{
		path: '/bookmarks',
		name: 'bookmarks',
	},
	{
		path: '/lick/random',
		redirect: () => `/lick/${Math.floor(Math.random() * store.state.totalNbLicks)}`,
	},
	{
		path: '/lick/:id',
		name: 'lick',
		components: {
			view:  loadAsyncComponent('LickView'),
			aside: loadAsyncComponent('LickAside'),
		},
		props: {
			view:  true,
			aside: true,
		}
	},
	{
		path: '*',
		name: '404',
		components: {
			view:  loadAsyncComponent('Page404View'),
			aside: loadAsyncComponent('Page404Aside'),
		}
	}
];

// Add the admin pages to the routes only in development mode
if (process.env.NODE_ENV === 'development')
{
	routes.push(
		{
			path: '/add',
			name: 'add',
			components: {
				view:   loadAsyncComponent('AdminView'),
				aside:  loadAsyncComponent('HomeAside'),
			}
		},
		{
			path: '/edit/:id',
			name: 'edit',
			components: {
				view:   loadAsyncComponent('AdminView'),
				aside:  loadAsyncComponent('HomeAside'),
			}
		}
	);
}

/**
 * Initialization
 * -----------------------------------------------------------------------------
 */
Vue.use(Router);
export default new Router({
	routes,

	mode: 'history',
	base: process.env.BASE_URL,

	// Reproduce native scrolling behaviour during navigation
	scrollBehavior: (to, from, savedPosition) => savedPosition ? savedPosition : { x: 0, y: 0 }
});

/**
 * Helper
 * -----------------------------------------------------------------------------
 */
function loadAsyncComponent(_component)
{
	return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${_component}`)
}
