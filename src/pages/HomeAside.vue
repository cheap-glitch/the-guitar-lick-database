

<!-- HomeAside.vue -->


<!--{{{ Pug -->
<template lang="pug">

nav.HomeAside

	//- Go to browsing page
	router-link.link(
		to="/browse"

		@click.left.native="$store.commit('browse/setBookmarkFilter', 'none')"
		)
		fa-icon(icon="list-ul")
		span browse

	//- Same as above, but with the bookmark filter activated
	router-link.link(
		to="/browse"

		@click.left.native="$store.commit('browse/setBookmarkFilter', 'bookmarked')"
		)
		fa-icon(icon="star")
		span bookmarks

	//- Go to the page of a random lick
	router-link.link(
		to="/lick/random"
		)
		fa-icon(icon="random")
		span random lick

	//- Open Fretboarder in a new tab
	a.link(
		href="https://fretboarder.app"
		target="_blank"
		rel="external nofollow noopener noreferrer"
		)
		fa-icon(icon="guitar")
		span fretboarder

	//- Open the Patreon page in a new tab
	a.link(
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
	name: 'HomeAside',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.HomeAside {
	@include space-children-v(10px);
}

.link {
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

	color: var(--color--aside--bg);
	background-color: var(--color--menu-button--bg);

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

		background-image: linear-gradient(30deg, var(--color--menu-button--highlight), var(--color--menu-button--bg));

		opacity: 0;
		transition: opacity 0.4s;
	}

	&:hover::before {
		opacity: 1;
	}
}

</style>
<!--}}}-->
