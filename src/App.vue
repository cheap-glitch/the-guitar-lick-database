

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(v-mods="darkMode")

	//----------------------------------------------------------------------
	//- Sidebar
	//----------------------------------------------------------------------
	aside.aside

		//- Logo
		header.aside__header
			h1.logo
				fa-icon.logo__icon(icon="comment-alt-music" mask="square-full")
				span.logo__text(:is="$route.path === '/' ? 'span' : 'router-link'" to="/") The Guitar Lick Database

		//- Page-specific tools/navigation
		router-view(name="aside")

		//- Main navigation menu
		MenuAside.aside__nav-menu

		//- Footer
		footer.aside__footer
			p.aside__footer__text TGLD v{{ version }} by cheap glitch
			div.aside__footer__links
				a.aside__footer__links__item(
					href="https://twitter.com/cheap_glitch"
					target="_blank"
					rel="external nofollow noreferrer"
					)
					fa-icon(:icon="['fab', 'twitter']")
				a.aside__footer__links__item(
					href="https://github.com/cheap-glitch"
					target="_blank"
					rel="external nofollow noreferrer"
					)
					fa-icon(:icon="['fab', 'github']")


	//----------------------------------------------------------------------
	//- Main view
	//----------------------------------------------------------------------
	ProgressBar
	section.page-wrapper

		//- Tiny header
		header.page-header
			div.dark-mode-toggle
				fa-icon(:icon="['fas', 'sun']")
				fa-icon(:icon="['fas', 'moon']")
				//- VButton(
					icon="adjust"
					:is-active="$store.state.isDarkModeOn"
					@click="$store.commit('toggleIsDarkModeOn')"
					)
			fa-icon(:icon="['fas', 'cog']")

		//- Page contents
		router-view(name="view")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }     from 'vuex-pathify'

import api         from '@/modules/api'
import MenuAside   from '@/components/MenuAside'
import ProgressBar from '@/components/ProgressBar'

export default {
	name: 'App',

	components: {
		MenuAside,
		ProgressBar,
	},

	computed: {
		version()
		{
			return process.env.VUE_APP_VERSION;
		},

		darkMode: get('darkMode'),
	},

	created()
	{
		// Get the total number of licks in the database
		api.get('licks/count', _data => this.$store.commit('setTotalNbLicks', _data || 200));
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	display: flex;

	flex: 1 0 auto;

	background-color: $color-athens-gray;

	transition: background-color 0.2s;

	&.dark-mode {
		background-color: $color-mirage;
	}
}

.page-wrapper {
	position: relative;
	overflow-x: hidden;

	flex: 1 1 100%;

	margin-left: $layout-aside-width + 40px;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	@include space-children-h(10px);

	position: absolute;
	top: 0;
	left: 0;
	right: 0;

	padding: 10px;

	color: darkgray;
}

.aside {
	display: grid;
	grid-template-rows: auto auto 1fr;
	grid-template-columns: 100%;
	@include space-children-v(20px);

	position: fixed;
	z-index: 2000;
	top: 0;
	left: 0;
	bottom: 0;

	width: $layout-aside-width;

	padding: 20px;

	background-color: $color-ebony-clay-2;
}

.aside__nav-menu {
	display: flex;
	flex-direction: column;
}

.aside__footer {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;

	font-size: 1.3rem;
}

.aside__footer__text {
	color: $color-nepal;
}

.aside__footer__links {
	display: flex;
	@include space-children-h(10px);
}

.aside__footer__links__item {
	color: $color-nepal;

	transition: color 0.2s;

	&:hover {
		color: $color-sun;
	}
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

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

// Apply the reset stylesheet
@use '@cheap-glitch/scss-reset/_reset';

// Apply the global styles
@use '@/styles/global';

// Set the theme color and import the default style for the custom sliders
@use '~vue-slider-component/lib/theme/default' with (
	$themeColor: $color-sun
);

// Load the font faces
@include font-face('Bebas Bold', './assets/fonts/bebas/bebas-bold');
@include font-face('IBM Plex',   './assets/fonts/ibm-plex/ibm-plex');

</style>
