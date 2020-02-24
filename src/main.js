
/**
 *  _____ _          _____     _ _              __    _     _      ____      _       _
 * |_   _| |_ ___   |   __|_ _|_| |_ ___ ___   |  |  |_|___| |_   |    \ ___| |_ ___| |_ ___ ___ ___
 *   | | |   | -_|  |  |  | | | |  _| .'|  _|  |  |__| |  _| '_|  |  |  | .'|  _| .'| . | .'|_ -| -_|
 *   |_| |_|_|___|  |_____|___|_|_| |__,|_|    |_____|_|___|_,_|  |____/|__,|_| |__,|___|__,|___|___|
 *
 * A powerful thesaurus for lead guitarists.
 *
 * Copyright (c) 2019-present, cheap glitch
 * This software is distributed under the GNU LGPL 3.0
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

requireBaseComponents.keys().forEach(function(fileName)
{
	const componentConfig = requireBaseComponents(fileName);
	const componentName   = fileName.split('/').pop().replace(/\.\w+$/, '');

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
router.beforeEach(function(to, from, next)
{
	store.commit('setProgressBar',     0);
	store.commit('setProgressBarMax', 90);

	next();
});
router.afterEach(() => store.commit('setProgressBarMax', 100));

/**
 * Create the Vue instance
 */
new Vue({ router, store, render: h => h(App) }).$mount('#app');
