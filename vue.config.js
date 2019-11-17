
/**
 * vue.config.js
 */

const htmlMinifier	  = require('html-minifier').minify;
const filterExternalLinks = require('./src/modules/filters').filterExternalLinks;

module.exports = {
	// Build the app into the 'build' folder
	outputDir: 'build',

	// Disable source maps in production
	productionSourceMap: false,

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
				'@/styles/mixins',
				'@/styles/mixins-other',
				'@/styles/colorscheme',
				]
				.map(_file => `@import "${_file}";`)
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

	/**
	 * Pre-rendering settings
	 */
	pluginOptions: {
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
		}
	},
}
