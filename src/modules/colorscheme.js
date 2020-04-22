
/**
 * modules/colorscheme.js
 */

import colors          from '@/styles/colors-export.scss'
import { mapToObject } from '@/modules/object'

/**
 * Define a light and dark colorscheme
 *  - light: Vue Dark Mode for the sidebar + white/gray/black for the main view
 *  - dark:  Ayu Dark for both
 */
export const colorscheme = {

	/**
	 * Text and main view
	 */
	'--color--bg':                     [colors.athensGray,   colors.ayuDeepBlack],
	'--color--bg--hover':              ['#e9e9e9',           colors.ayuBlack],
	'--color--bg--accent':             ['gray',              colors.ayuDeepSlate],

	'--color--text':                   ['#222',              colors.ayuDirtyWhite],
	'--color--text--secondary':        ['gray',              colors.ayuSlate],

	'--color--border':                 ['lightgray',         colors.ayuSlate2],

	/**
	 * Sidebar
	 */
	'--color--aside--bg':              [colors.ebonyClay2,   colors.ayuDeepSlate],

	'--color--menu-button--bg':        [colors.azure,        colors.ayuBlue],
	'--color--menu-button--highlight': [colors.portage,      colors.ayuCyan],

	/**
	 * UI components (dark background)
	 */
	'--color--ui--bg':                 [colors.mirage,       colors.ayuBlack],
	'--color--ui--bg--hover':          [colors.ebonyClay,    colors.ayuDeepSlate],
	'--color--ui--bg--accent':         [colors.ebonyClay2,   colors.ayuSlate2],
	'--color--ui--bg--highlight':      [colors.sun,          colors.ayuOrangeYellow],

	'--color--ui--text':               [colors.regentStBlue, colors.ayuDirtyWhite],
	'--color--ui--text--secondary':    [colors.nepal,        colors.ayuSlate],

	'--color--ui--border':             [colors.oxfordBlue,   colors.ayuSlate2],
	'--color--ui--border--secondary':  [colors.ebonyClay,    colors.ayuDeepSlate],

	'--color--ui--selected':           [colors.malachite,    colors.ayuGreen],
	'--color--ui--excluded':           [colors.crimson,      colors.ayuRed],

};

export const colorschemeUILightBg = {

	/**
	 * UI components (light background)
	 */
	'--color--ui--bg':                colorscheme['--color--bg'],
	'--color--ui--bg--hover':         ['#e9e9e9', colors.ayuDeepSlate],

	'--color--ui--text':              colorscheme['--color--text'],

	'--color--ui--border':            colorscheme['--color--border'],
};

export function getColorschemeMode(colorscheme, isDarkMode)
{
	return mapToObject(colorscheme, (varName, values) => values[isDarkMode ? 1 : 0]);
}
