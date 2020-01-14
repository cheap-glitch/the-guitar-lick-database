
/**
 * routes.js
 */

const TOTAL_NB_LICKS = 220;

// Helper function to load a component asynchronously and split it in its own chunk
const loadAsyncComponent = _component => (() => import(/* webpackChunkName: "view-[request]" */ `@/components/${_component}`));

// Define the routes
const routes = [
	{
		path: '/',
		name: 'home',
		components: {
			view:  loadAsyncComponent('HomeView'),
			aside: loadAsyncComponent('HomeAside'),
		},
		sitemap: {
			priority: 1.0,
		}
	},
	{
		path: '/browse',
		name: 'browse',
		components: {
			view:  loadAsyncComponent('BrowseView'),
			aside: loadAsyncComponent('BrowseAside'),
		},
		sitemap: {
			changefreq: 'always',
		}
	},
	{
		path: '/bookmarks',
		name: 'bookmarks',
		sitemap: {
			ignoreRoute: true,
		}
	},
	{
		path: '/lick/random',
		redirect: () => `/lick/${Math.floor(Math.random() * TOTAL_NB_LICKS)}`,
		sitemap: {
			ignoreRoute: true,
		}
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
		},
		sitemap: {
			changefreq:  'yearly',
			slugs:       [...new Array(TOTAL_NB_LICKS).keys()].map(_id => _id + 1),
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

module.exports = routes;
