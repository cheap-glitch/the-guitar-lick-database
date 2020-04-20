
/**
 * vue.config.js
 */

const htmlMinifier          = require('html-minifier').minify;

const routes                = require('./src/routes');
const filterExternalLinks   = require('./src/modules/filters').filterExternalLinks;
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
	// Build the app into the 'build' folder
	outputDir: 'build',

	// Disable source maps in production
	productionSourceMap: false,

	// Display both warnings and errors in the dev overlay
	devServer: {
		https: true,
		host:  'localhost',
		port:  8080,

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
					'sass-mq/_mq.scss',
					'@cheap-glitch/scss-mixins/_mixins',

					'@/styles/layout',
				]
				.map(file => `@use '${file}' as *;`)
				.join('\n')
			}
		},
	},

	/**
	 * Pug settings
	 */
	chainWebpack: config => {
		config.module
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
			imports: {
				// General UI
				'arrow-circle-left':         'pro-regular',
				'chevron-down':              'pro-regular',
				'cog':                       'pro-solid',
				'external-link-square-alt':  'pro-regular',
				'moon':                      'pro-solid',
				'star':                     ['pro-solid', 'pro-regular'],
				'sun':                       'pro-solid',
				'trash-alt':                 'pro-regular',

				// Logo
				'comment-alt-music':         'pro-solid',
				'square-full':               'pro-solid',

				// Main navigation menu
				'guitar':                    'pro-solid',
				'heart':                     'pro-solid',
				'list-ul':                   'pro-solid',
				'random':                    'pro-solid',

				// Footer
				'github':                    'free-brands',
				'twitter':                   'free-brands',

				// Lick infos
				'album':                     'pro-regular',
				'book':                      'pro-regular',
				'compact-disc':              'pro-regular',
				'file-alt':                  'pro-regular',
				'file-music':                'pro-regular',
				'guitar-electric':           'pro-regular',
				'mountain':                  'pro-regular',
				'music':                     'pro-regular',
				'tags':                      'pro-regular',
				'user-circle':               'pro-regular',
				'youtube':                   'free-brands',

				// Player
				'drum':                      'pro-regular',
				'dumbbell':                  'pro-regular',
				'minus':                     'pro-regular',
				'pause':                     'pro-regular',
				'play':                      'pro-regular',
				'plus':                      'pro-regular',
				'search-minus':              'pro-regular',
				'search-plus':               'pro-regular',
				'stop':                      'pro-regular',
				'stopwatch':                 'pro-regular',
				'undo-alt':                  'pro-regular',
			}
		},

		/**
		 * Pre-rendering
		 */
		prerenderSpa: {
			registry:        undefined,
			headless:        true,
			onlyProduction:  true,
			useRenderEvent:  false,

			renderRoutes: [
				'/',
			],

			postProcess(route)
			{
				route.html =

					// Minify the Font Awesome-related CSS
					htmlMinifier(route.html, { minifyCSS: true })

					// Tell Vue to trigger hydration
					.replace('id="app"', 'id="app" data-server-rendered="true"');

				return route;
			}
		},

		/**
		 * Sitemap
		 */
		sitemap: {
			routes,

			productionOnly: true,
			trailingSlash:  false,
			baseURL:        'https://www.theguitarlickdatabase.com',
		},
	},
}
