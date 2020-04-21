
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
	'--color--bg':                [colors.athensGray,   colors.ayuDeepBlack],
	'--color--bg--hover':         ['#e9e9e9',           colors.ayuBlack],
	'--color--bg--accent':        ['gray',              colors.ayuDeepSlate],

	'--color--text':              ['#222',              colors.ayuDirtyWhite],
	'--color--text-2':            ['gray',              colors.ayuSlate],

	'--color--border':            ['lightgray',         colors.ayuSlate2],

	/**
	 * Sidebar
	 */
	'--color--aside--bg':         [colors.ebonyClay2,   colors.ayuDeepSlate],

	/**
	 * UI components (dark background)
	 */
	'--color--ui--bg':            [colors.mirage,       colors.ayuDeepSlate],
	'--color--ui--bg--hover':     [colors.ebonyClay,    colors.ayuSlate2],
	'--color--ui--bg--accent':    [colors.ebonyClay2,   colors.ayuSlate],
	'--color--ui--bg--highlight': [colors.sun,          colors.ayuOrangeYellow],

	'--color--ui--text':          [colors.regentStBlue, colors.ayuIvory],
	'--color--ui--text-2':        [colors.nepal,        colors.ayuDirtyWhite],

	'--color--ui--border':        [colors.oxfordBlue,   colors.ayuSlate],
	'--color--ui--border-2':      [colors.ebonyClay,    colors.ayuSlate2],

	'--color--ui--selected':      [colors.malachite,    colors.ayuGreen],
	'--color--ui--excluded':      [colors.crimson,      colors.ayuRed],

};

export const colorschemeUILightBg = {

	/**
	 * UI components (light background)
	 */
	'--color--ui--bg':            colorscheme['--color--bg--hover'],
	'--color--ui--bg--hover':     colorscheme['--color--bg--hover'],

	'--color--ui--text':          colorscheme['--color--text'],

	'--color--ui--border':        colorscheme['--color--border'],
};

export function getColorschemeMode(colorscheme, isDarkMode)
{
	return mapToObject(colorscheme, (varName, values) => values[isDarkMode ? 1 : 0]);
}
