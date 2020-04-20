

<!-- MenuAside.vue -->


<!--{{{ Pug -->
<template lang="pug">

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

		// Same as above, but with the bookmark filter activated
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

		// Open Fretboarder in a new tab
		a.nav-menu__button(
			v-show="$route.path === '/'"

			href="https://fretboarder.app"
			target="_blank"
			rel="external nofollow noopener noreferrer"
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
<style lang="scss" scoped>

@use '@/styles/colors' as *;

.nav-menu {
	@include space-children-v(10px);
}

.nav-menu__button {
	@include space-children-h(10px);

	position: relative;
	display: block;
	z-index: 1;

	padding: 8px 18px;

	text-decoration: none;

	font-family: 'IBM Plex';
	font-size: 1em;
	font-weight: bold;

	@include pill;

	color: var(--color--ui--bg);
	background-color: $color--azure;

	user-select: none;

	&::before {
		content: '';
		@include pill;

		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;

		background-image: linear-gradient(30deg, $color--portage, $color--azure);

		opacity: 0;
		transition: opacity 0.4s;
	}

	&:hover::before {
		opacity: 1;
	}
}

</style>
<!--}}}-->
