
/**
 * the-guitar-lick-database
 *
 * A powerful thesaurus for lead guitarists.
 *
 * Copyright (c) 2019-present, cheap glitch
 *
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either  version 3 of the  License, or (at your  option) any later
 * version.
 *
 * This program is distributed  in the hope that it will  be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR  A PARTICULAR  PURPOSE.  See  the GNU  General  Public  License for  more
 * details.
 *
 * You should have received a copy of  the GNU General Public License along with
 * this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Vue             from 'vue'
import Router          from 'vue-router'
import VueSlider       from 'vue-slider-component'
import VClickOutside   from 'v-click-outside'
import VueCSSModifiers from 'vue-css-modifiers'

import App             from '@/App'
import store           from '@/stores/main'
import routes          from '@/routes'

/**
 * Register plugins, directives & external components
 */
Vue.use(Router);
Vue.component('vue-slider',    VueSlider);
Vue.directive('mods',          VueCSSModifiers);
Vue.directive('click-outside', VClickOutside.directive);

/**
 * Register globally the base components
 */
const requireBaseComponents = require.context('@/components', false, /V[A-Z]\w+\.vue$/);

requireBaseComponents.keys().forEach(function(_fileName)
{
	const componentConfig = requireBaseComponents(_fileName);
	const componentName   = _fileName.split('/').pop().replace(/\.\w+$/, '');

	Vue.component(componentName, componentConfig.default || componentConfig);
});

/**
 * Create the router
 */
const router = new Router({
	routes,

	mode: 'history',
	base: process.env.BASE_URL,

	// Reproduce native scrolling behaviour during navigation
	scrollBehavior: (to, from, savedPosition) => savedPosition ? savedPosition : { x: 0, y: 0 }
});

// Hook the top progress bar to the app navigation
router.beforeResolve(function(_to, _from, _next)
{
	store.commit('progressbar/start');
	_next();
});
router.afterEach(() => store.commit('progressbar/stop'));

/**
 * Create the Vue instance
 */
new Vue({ router, store, render: _h => _h(App) }).$mount('#app');
