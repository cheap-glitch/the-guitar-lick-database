
/**
 * vue.config.js
 */

const htmlMinifier        = require('html-minifier').minify;

const routes              = require('./src/routes');
const filterExternalLinks = require('./src/modules/filters').filterExternalLinks;

module.exports = {
	// Build the app into the 'build' folder
	outputDir: 'build',

	// Disable source maps in production
	productionSourceMap: false,

	// Display both warnings and errors in the dev overlay
	devServer: {
		overlay: {
			errors:   true,
			warnings: true,
		}
	},

	/**
	 * CSS-related settings
	 */
	css: {
		// Enable source maps in dev mode
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the colorscheme & mixins globally
		loaderOptions: {
			sass: {
				prependData: [
					'@/styles/colorscheme',
					'@/styles/layout',
					'@/styles/mixins',
				]
				.map(_file => `@use "${_file}" as *;`)
				.join('\n')
			}
		},
	},

	/**
	 * Pug settings
	 */
	chainWebpack: _config => {
		_config.module
		.rule('pug')
		.oneOf('pug-vue')
		.use('pug-plain-loader')
		.loader('pug-plain-loader')
		.tap(() => ({
			filters: {
				// Add a text filter to parse the custom syntax for
				// external links in Markdown files
				'external-links': filterExternalLinks,
			}
		}));
	},

	pluginOptions: {
		/**
		 * Font Awesome
		 */
		fontawesome: {
			component: 'fa-icon',
			imports: [
				{
					set: 'free-brands',
					icons: [
						// Sidebar
						'github',
						'twitter',

						// Lick infos
						'youtube',
					]
				},
				{
					set: 'pro-solid',
					icons: [
						// General UI
						'star',

						// Logo
						'comment-alt-music',
						'square-full',

						// Main navigation menu
						'guitar',
						'heart',
						'list-ul',
						'random',
					]
				},
				{
					set: 'pro-regular',
					icons: [
						// General UI
						'adjust',
						'arrow-circle-left',
						'chevron-down',
						'external-link-square-alt',
						'star',
						'trash-alt',

						// Lick infos
						'album',
						'book',
						'compact-disc',
						'file-alt',
						'file-music',
						'guitar-electric',
						'mountain',
						'music',
						'tags',
						'user-circle',

						// Player
						'drum',
						'dumbbell',
						'minus',
						'pause',
						'play',
						'plus',
						'search-minus',
						'search-plus',
						'stop',
						'stopwatch',
						'undo-alt',
					]
				},
			]
		},

		/**
		 * Pre-rendering
		 */
		prerenderSpa: {
			registry: undefined,
			headless: true,
			onlyProduction: true,
			useRenderEvent: false,

			renderRoutes: [
				'/',
			],

			postProcess(_route)
			{
				_route.html =

					// Minify the Font Awesome-related CSS
					htmlMinifier(_route.html, { minifyCSS: true })

					// Tell Vue to trigger hydration
					.replace('id="app"', 'id="app" data-server-rendered="true"');

				return _route;
			}
		},

		/**
		 * Sitemap
		 */
		sitemap: {
			productionOnly: true,

			baseURL:        'https://www.theguitarlickdatabase.com',
			trailingSlash:  false,

			routes,
		},
	},
}
