
/**
 * modules/colorscheme.js
 */

import colors from '@/styles/colors-export.scss'

/**
 * Define a light and dark colorscheme
 *  - Light: Vue Dark Mode for the sidebar + white/gray/black for the main view
 *  - Dark:  Ayu Dark for both
 */
export default {

	/**
	 * Text and main view
	 */

	'--color--bg':                  [colors.athensGray,   colors.ayuBg],

	'--color--text':                ['#222',              colors.ayuFgText],
	'--color--text-2':              ['gray',              colors.nepal],

	'--color--border':              [colors.athensGray,   colors.mirage],

	/**
	 * UI components (dark background)
	 */

	'--color--ui--bg':              [colors.mirage,       colors.mirage],
	'--color--ui--bg--hover':       [colors.ebonyClay,    colors.ebonyClay],
	'--color--ui--bg--accent':      [colors.ebonyClay2,   colors.ebonyClay2],
	'--color--ui--bg--highlight':   [colors.sun,          colors.sun],

	'--color--ui--text':            [colors.regentStBlue, colors.regentStBlue],
	'--color--ui--text-2':          [colors.nepal,        colors.nepal],

	'--color--ui--border':          [colors.oxfordBlue,   colors.oxfordBlue],
	'--color--ui--border-2':        [colors.ebonyClay,    colors.ebonyClay],

	/**
	 * UI components (light background)
	 */

	'--color--ui-light--bg':        [colors.athensGray,   colors.mirage],
	'--color--ui-light--bg--hover': ['#e9e9e9',           colors.ebonyClay],

	'--color--ui-light--text':            ['gray', 'gray'],
}
