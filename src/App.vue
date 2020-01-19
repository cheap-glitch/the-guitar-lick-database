

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App
	//----------------------------------------------------------------------
	//- Sidebar
	//----------------------------------------------------------------------
	aside.aside

		//- Logo
		header: h1.logo
			fa-icon.logo__icon(icon="comment-alt-music" mask="square-full")
			span.logo__text(:is="$route.path === '/' ? 'span' : 'router-link'" to="/") The Guitar Lick Database

		//- Links + dark mode switch
		div.toolbar
			VButton(
				icon="adjust"
				:is-active="$store.state.isDarkModeOn"

				@click="$store.commit('toggleIsDarkModeOn')"
				)
			a(
				href="https://twitter.com/cheap_glitch"
				target="_blank"
				rel="external nofollow noreferrer"
				)
				fa-icon(:icon="['fab', 'twitter']")
			a(
				href="https://github.com/cheap-glitch"
				target="_blank"
				rel="external nofollow noreferrer"
				)
				fa-icon(:icon="['fab', 'github']")

		//- Page-specific tools/navigation
		router-view(name="aside")

		//- Main navigation menu
		MenuAside.nav-menu

	//----------------------------------------------------------------------
	//- Main view
	//----------------------------------------------------------------------
	router-view(name="view").view

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import api       from '@/modules/api'
import MenuAside from '@/pages/MenuAside'

export default {
	name: 'App',

	components: {
		MenuAside,
	},

	created() {
		// Get the total number of licks in the database
		api.get('licks/count', _data => this.$store.commit('setTotalNbLicks', _data || 200));
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	display: flex;

	flex: 1 0 auto;

	background-color: $color-athens-gray;
}

.aside {
	display: grid;
	grid-template-rows: auto auto 1fr;
	grid-template-columns: 100%;
	@include space-children-v(20px);

	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	bottom: 0;

	width: 280px;

	padding: 20px;

	background-color: $color-ebony-clay-2;
}

.logo {
	display: flex;
	@include space-children-h(14px);
}

.logo__icon {
	line-height: 60px;

	margin-right: 10px;

	font-size: 60px;

	color: $color-ebony-clay-2;
	background-image:
		radial-gradient(circle at top right, change-color($color-crimson, $alpha: 0.2), transparent),
		radial-gradient(circle at top left,  $color-sun, $color-cinnabar);
}

.logo__text {
	line-height: 35px;

	text-decoration: none;

	font-size: 35px;
	font-family: 'Bebas Bold';

	color: transparent;
	background-image:
		radial-gradient(circle at top right, change-color($color-crimson, $alpha: 0.4), transparent),
		radial-gradient(circle at top left,  $color-sun, $color-cinnabar);
	background-clip: text;

	user-select: none;
}

.toolbar {
	display: flex;
	align-items: center;
	@include space-children-h(20px);
}

.nav-menu {
	display: flex;
	flex-direction: column;
}

.view {
	overflow-x: hidden;

	flex: 1 1 100%;

	margin-left: 340px;
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

// Apply the reset stylesheet
@use '@/styles/reset' as *;

// Apply the global styles
@use '@/styles/global' as *;

// Set the theme color and import the default style for the custom sliders
@use '~vue-slider-component/lib/theme/default' with (
	$themeColor: $color-sun
);

// Load the font faces
@include font-face('Bebas',       './assets/fonts/bebas/bebas');
@include font-face('Bebas Bold',  './assets/fonts/bebas/bebas-bold');
@include font-face('IBM Plex',    './assets/fonts/ibm-plex/ibm-plex');

</style>
