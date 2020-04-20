
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

	'--color--bg':                [colors.athensGray,   colors.ayuBg],

	'--color--text':              ['#222',              colors.ayuFgText],
	'--color--text-2':            ['gray',              colors.nepal],

	'--color--border':            [colors.athensGray,   colors.mirage],

	/**
	 * UI components (dark background)
	 */

	'--color--ui--bg':            [colors.mirage,       colors.mirage],
	'--color--ui--bg--hover':     [colors.ebonyClay,    colors.ebonyClay],
	'--color--ui--bg--accent':    [colors.ebonyClay2,   colors.ebonyClay2],
	'--color--ui--bg--highlight': [colors.sun,          colors.sun],

	'--color--ui--text':          [colors.regentStBlue, colors.regentStBlue],
	'--color--ui--text-2':        [colors.nepal,        colors.nepal],

	'--color--ui--border':        [colors.oxfordBlue,   colors.oxfordBlue],
	'--color--ui--border-2':      [colors.ebonyClay,    colors.ebonyClay],

	'--color--ui--selected':      [colors.malachite,    colors.malachite],
	'--color--ui--excluded':      [colors.crimson,      colors.crimson],

};

export const colorschemeUILightBg = {

	/**
	 * UI components (light background)
	 */

	'--color--ui--bg':            [colors.athensGray,   colors.mirage],
	'--color--ui--bg--hover':     ['#e9e9e9',           colors.ebonyClay],

	'--color--ui--text':          ['gray',              'gray'],
};

export function getColorschemeMode(colorscheme, isDarkMode)
{
	return mapToObject(colorscheme, (varName, values) => values[isDarkMode ? 1 : 0]);
}
