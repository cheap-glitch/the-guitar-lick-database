

<!-- MenuAside.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.MenuAside
	nav.nav-menu
		// Go to browsing page
		router-link.nav-menu__button(
			v-show="$route.path !== '/browse'"
			to="/browse"

			@click.left.native="$store.commit('browse/setBookmarkFilter', 'none')"
			)
			fa-icon(icon="list-ul")
			span browse

		// Idem, but with the bookmark filter activated
		router-link.nav-menu__button(
			v-show="$route.path !== '/browse'"
			to="/browse"

			@click.left.native="$store.commit('browse/setBookmarkFilter', 'bookmarked')"
			)
			fa-icon(icon="star")
			span bookmarks

		// Go to the page of a random lick
		router-link.nav-menu__button(
			to="/lick/random"
			)
			fa-icon(icon="random")
			span random lick

		// Go to the Fretboarder page
		//- router-link.nav-menu__button(
			v-show="$route.path !== '/fretboarder'"
			to="/fretboarder"
			)
			fa-icon(icon="guitar")
			span fretboarder

		// Open the Patreon page in a new tab
		a.nav-menu__button(
			v-show="$route.path === '/'"

			href="https://www.patreon.com/cheap_glitch"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(icon="heart")
			span support

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'MenuAside',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.nav-menu {
	@include space-children-v(10px);
}

.nav-menu__button {
	@include space-children-h(10px);

	display: block;

	padding: 8px 18px;

	text-decoration: none;

	font-family: 'IBM Plex';
	font-size: 1em;
	font-weight: bold;

	@include pill;

	color: $color-ebony-clay;
	background-color: $color-azure;

	user-select: none;
}

</style>
<!--}}}-->
