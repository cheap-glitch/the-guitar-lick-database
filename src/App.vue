

<!-- App.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.App
	//----------------------------------------------------------------------
	//- Sidebar
	//----------------------------------------------------------------------
	aside.aside

		//- Logo
		header: h1.logo
			fa-icon.logo__icon(icon="comment-alt-music" mask="square-full")
			span.logo__text(:is="$route.path === '/' ? 'span' : 'router-link'" to="/") The Guitar Lick Database

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

import api       from '@/modules/api';
import MenuAside from '@/components/MenuAside';

export default {
	name: 'App',

	components: {
		MenuAside,
	},

	created() {
		// Get the total number of licks in the database
		api.get('licks/count', _data => this.$store.commit('setTotalNbLicks', _data));
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.App {
	display: flex;

	flex: 1 0 auto;

	background-color: $color-athens-gray;
}

.aside {
	display: grid;
	grid-template-rows: auto auto 1fr;
	grid-template-columns: 100%;

	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	bottom: 0;

	width: 300px;

	padding: 20px;

	background-color: $color-ebony-clay-2;
}

.logo__icon {
	margin-right: 10px;

	font-size: 50px;
	line-height: 50px;

	color: $color-ebony-clay-2;
	background-image:
		radial-gradient(circle at top right, change-color($color-crimson, $alpha: 0.2), transparent),
		radial-gradient(circle at top left,  $color-sun, $color-cinnabar);
}

.logo__text {
	line-height: 60px;

	text-decoration: none;

	font-size: 60px;
	font-family: 'Bebas Bold';

	color: transparent;
	background-image:
		radial-gradient(circle at top right, change-color($color-crimson, $alpha: 0.4), transparent),
		radial-gradient(circle at top left,  $color-sun, $color-cinnabar);
	background-clip: text;

	user-select: none;
}

.nav-menu {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.view {
	overflow-x: hidden;

	flex: 1 1 100%;

	margin-left: 340px;
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang='scss'>

// Load the font faces
@include font-face('Bebas',       './assets/fonts/bebas/bebas');
@include font-face('Bebas Bold',  './assets/fonts/bebas/bebas-bold');
@include font-face('IBM Plex',    './assets/fonts/ibm-plex/ibm-plex');

// Apply the reset stylesheet
@import '@/styles/reset';

// Apply the global styles
@import '@/styles/global';

</style>
