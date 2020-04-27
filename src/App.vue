

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")

	//----------------------------------------------------------------------
	//- Sidebar
	//----------------------------------------------------------------------
	aside.sidebar(:class="`page-${$route.name}`")

		//- Logo
		h1: span.logo(
			:is="$route.name == 'home' ? 'span' : 'router-link'"
			to="/"
			)
			fa-icon.logo__icon(
				icon="comment-alt-music"
				mask="square-full"
				)
			span.logo__text(v-show="$route.name != 'lick'") The Guitar Lick Database


		//- Page-specific tools/navigation
		router-view(name="sidebar")

		//- Footer
		footer.sidebar__footer

			//- Light/dark switch
			div.dark-mode-toggle(@click="$store.commit('toggleIsDarkModeOn')")
				fa-icon(:icon="['fas', 'sun']")
				div.dark-mode-toggle__switch(v-mods="{ isDarkModeOn }")
				fa-icon(:icon="['fas', 'moon']")

	//----------------------------------------------------------------------
	//- Main view
	//----------------------------------------------------------------------
	section.view(:class="`page-${$route.name}`")
		ProgressBar
		router-view(name="view")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                from 'vuex-pathify'

import api                    from '@/modules/api'
import { colorscheme }        from '@/modules/colorscheme'
import { getColorschemeMode } from '@/modules/colorscheme'

import ProgressBar            from '@/components/ProgressBar'

export default {
	name: 'App',

	components: {
		ProgressBar,
	},

	computed: {
		colorscheme()
		{
			return getColorschemeMode(colorscheme, this.isDarkModeOn);
		},
		isDarkModeOn: get('isDarkModeOn'),
	},

	created()
	{
		// Get the total number of licks in the database
		api.get('licks/count', data => this.$store.commit('setTotalNbLicks', data || 200));
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/colors' as *;
@use '@/styles/layout' as *;

.App {
	flex: 1 0 auto;

	background-color: var(--color--bg);

	transition: background-color 0.2s;
}

.sidebar {
	display: flex;
	flex-direction: column;
	@include space-children-v(40px);

	position: fixed;
	z-index: 2000;
	top: 0;
	left: 0;
	bottom: 0;

	padding: 20px;

	border-right: 1px solid var(--color--ui--border);
	background-color: var(--color--aside--bg);

	transition: width 0.2s;

	@each $page, $width in $layout--sidebar-width
	{
		&.page-#{$page} { width: $width; }
	}
}

.view {
	position: relative;
	overflow-x: hidden;

	transition: margin-left 0.2s;

	@each $page, $width in $layout--sidebar-width
	{
		&.page-#{$page} { margin-left: calc(#{$width} + 40px); }
	}
}

.logo {
	display: flex;
	@include space-children-h(14px);

	max-width: 250px;

	text-decoration: none;
}

@mixin logo-gradient($alpha)
{
	background-image:
		radial-gradient(circle at top right, change-color($color--crimson, $alpha: $alpha), transparent),
		radial-gradient(circle at top left,  $color--sun, $color--cinnabar);
}

.logo__icon {
	line-height: 60px;

	margin-right: 10px;

	font-size: 60px;

	color: var(--color--aside--bg);
	@include logo-gradient(0.2);
}

.logo__text {
	line-height: 35px;

	font-size: 35px;
	font-family: 'Bebas Bold';

	color: transparent;
	background-clip: text;
	@include logo-gradient(0.4);

	user-select: none;
}

.sidebar__footer {
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;

	flex: 1 1 100%;
}

.dark-mode-toggle {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	color: var(--color--ui--text--secondary);

	cursor: pointer;
}

.dark-mode-toggle__switch {
	position: relative;

	width: 20px;
	height: 12px;
	@include pill;

	border: 2px solid var(--color--ui--border);

	&::after {
		content: '';

		position: absolute;
		top: 0;
		left: 0;

		@include circle(8px);

		background-color: var(--color--ui--bg--highlight);

		transition: transform 0.2s;
	}

	&.is-dark-mode-on::after {
		transform: translateX(8px);
	}
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
	$themeColor: var(--color--ui--bg--highlight)
);

// Load the font faces
@include font-face('Bebas Bold', './assets/fonts/bebas/bebas-bold');
@include font-face('IBM Plex',   './assets/fonts/ibm-plex/ibm-plex');

</style>
