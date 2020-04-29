
/**
 * vue.config.js
 */

const fs                        = require('fs');
const path                      = require('path');
const walk                      = require('klaw-sync');
const minify                    = require('html-minifier').minify;
const MarkdownIt                = require('markdown-it');

const routes                    = require('./src/routes');
const filterExternalLinks       = require('./src/modules/filters').filterExternalLinks;

process.env.VUE_APP_VERSION     = require('./package.json').version;
process.env.VUE_APP_DESCRIPTION = require('./package.json').description;

const markdown = new MarkdownIt({
	breaks:      true,
	typographer: true,
});

module.exports = {
	productionSourceMap: false,

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
	 * SCSS
	 */
	css: {
		// Enable source maps in dev mode only
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the mixins in every component
		loaderOptions: { sass: { prependData: '@use "@cheap-glitch/scss-mixins/_mixins" as *;' } },
	},

	/**
	 * Pug templates
	 */
	chainWebpack: config => {
		config.module
		.rule('pug')
		.oneOf('pug-vue')
		.use('pug-plain-loader')
		.loader('pug-plain-loader')
		.tap(() => ({
			data: {
				/**
				 * Load the contents of all update posts
				 */
				updatePosts: walk(path.resolve(__dirname, './src/assets/posts')).map(file => ({
					date:     file.path.split('/').pop().split('_')[0],
					contents: markdown.render(fs.readFileSync(file.path).toString()),
				}))
			},
			filters: {
				/**
				 * Add a text filter to parse the custom syntax
				 * for external links in Markdown files
				 */
				'external-links': filterExternalLinks
			}
		}));
	},

	pluginOptions: {
		/**
		 * Font Awesome icons
		 */
		fontawesome: {
			component: 'fa-icon',
			imports: {
				// General UI
				'arrow-circle-left':        'pro-regular',
				'chevron-down':             'pro-regular',
				'cog':                      'pro-solid',
				'external-link-square-alt': 'pro-regular',
				'moon':                     'pro-solid',
				'star':                    ['pro-solid', 'pro-regular'],
				'sun':                      'pro-solid',
				'trash-alt':                'pro-regular',

				// Logo
				'comment-alt-music':        'pro-solid',
				'square-full':              'pro-solid',

				// Main navigation menu
				'guitar':                   'pro-solid',
				'heart':                    'pro-solid',
				'list-ul':                  'pro-solid',
				'random':                   'pro-solid',

				// Footer
				'github':                   'free-brands',
				'twitter':                  'free-brands',

				// Lick infos
				'album':                    'pro-regular',
				'book':                     'pro-regular',
				'compact-disc':             'pro-regular',
				'file-alt':                 'pro-regular',
				'file-music':               'pro-regular',
				'guitar-electric':          'pro-regular',
				'mountain':                 'pro-regular',
				'music':                    'pro-regular',
				'tags':                     'pro-regular',
				'user-circle':              'pro-regular',
				'youtube':                  'free-brands',

				// Player
				'drum':                     'pro-regular',
				'dumbbell':                 'pro-regular',
				'minus':                    'pro-regular',
				'pause':                    'pro-regular',
				'play':                     'pro-regular',
				'plus':                     'pro-regular',
				'search-minus':             'pro-regular',
				'search-plus':              'pro-regular',
				'stop':                     'pro-regular',
				'stopwatch':                'pro-regular',
				'undo-alt':                 'pro-regular',
			}
		},

		/**
		 * Pre-rendering
		 */
		prerenderSpa: {
			registry:       undefined,
			headless:       true,
			onlyProduction: true,
			useRenderEvent: false,

			renderRoutes: [
				'/',
			],

			postProcess(route)
			{
				return { ...route, html:
					// Minify the Font Awesome-related CSS
					minify(route.html, { minifyCSS: true })
					// Tell Vue to trigger hydration
					.replace('id="app"', 'id="app" data-server-rendered="true"')
				};
			}
		},

		/**
		 * Sitemap
		 */
		sitemap: {
			productionOnly: true,

			routes,
			baseURL: 'https://www.theguitarlickdatabase.com',
			trailingSlash: false,
		},
	},
}
