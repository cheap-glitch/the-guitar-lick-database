
/**
 * routes.js
 */

// @TODO: get from the db?
const TOTAL_NB_LICKS = 220;

/**
 * Helper function to load a component
 * asynchronously and split it in its own chunk
 */
const loadAsyncComponent = component => (() => import(/* webpackChunkName: "view-[request]" */ `@/pages/${component}`));

const routes = [
	{
		path: '/',
		name: 'home',

		components: {
			view:    loadAsyncComponent('HomeView'),
			sidebar: loadAsyncComponent('HomeAside'),
		},

		meta: {
			sitemap: {
				priority: 1.0,
			}
		}
	},
	{
		path: '/browse',
		name: 'browse',

		components: {
			view:    loadAsyncComponent('BrowseView'),
			sidebar: loadAsyncComponent('BrowseAside'),
		},

		meta: {
			sitemap: {
				changefreq: 'always',
			}
		}
	},
	{
		path: '/lick/random',
		redirect: () => `/lick/${Math.floor(Math.random() * TOTAL_NB_LICKS)}`,

		meta: {
			sitemap: {
				ignoreRoute: true,
			}
		}
	},
	{
		path: '/lick/:id',
		name: 'lick',

		components: {
			view:    loadAsyncComponent('LickView'),
			sidebar: loadAsyncComponent('LickAside'),
		},

		props: {
			view:  true,
			sidebar: true,
		},
		meta: {
			sitemap: {
				changefreq: 'yearly',
				slugs:      [...new Array(TOTAL_NB_LICKS).keys()].map(id => id + 1),
			}
		}
	},
	{
		path: '*',
		name: '404',

		components: {
			view:    loadAsyncComponent('Page404View'),
			sidebar: loadAsyncComponent('HomeAside'),
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
				view:    loadAsyncComponent('AdminView'),
				sidebar: loadAsyncComponent('HomeAside'),
			},

			meta: {
				sitemap: {
					ignoreRoute: true,
				}
			},
		},
		{
			path: '/edit/:id',
			name: 'edit',

			components: {
				view:    loadAsyncComponent('AdminView'),
				sidebar: loadAsyncComponent('HomeAside'),
			},

			meta: {
				sitemap: {
					ignoreRoute: true,
				}
			},
		},
	);
}

module.exports = routes;
