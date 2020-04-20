

<!-- BrowseViewPagelist.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.BrowseViewPagelist
	nav.pages(v-show="nbPages > 1")
		div.pages__item(
			v-for="n in nbPages"
			:key="`page-${n}`"
			v-mods="{ isCurrentPage: n == currentPage }"

			@click.left="goToPage(n)"
			)
			p.pages__item__number(
				v-mods="{ isCurrentPage: n == currentPage }"
				) {{ n }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get } from 'vuex-pathify'

export default {
	name: 'BrowseViewPagelist',

	computed: {
		...get('browse', [
			'nbPages',
			'currentPage',
		]),
	},

	methods: {
		goToPage(newPage)
		{
			if (newPage != this.currentPage)
				this.$store.commit('browse/setCurrentPage', newPage);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.pages {
	display: flex;
	flex-wrap: wrap;
	@include space-children-h(5px);
	@include space-children-v(5px);
}

.pages__item,
.pages__item__number {
	&:not(.is-current-page) {
		cursor: pointer;
	}
}

.pages__item {
	@include center-content;

	@include square(30px);

	background-color: var(--color--ui-light--bg);

	transition: background-color 0.2s;

	&.is-current-page {
		background-color: var(--color--ui--bg--highlight);
	}

	&:not(.is-current-page):hover {
		background-color: var(--color--ui-light--bg--hover);
	}
}

.pages__item__number {
	color: var(--color--ui-light--text);

	user-select: none;

	&.is-current-page {
		color: white;
	}
}

</style>
<!--}}}-->
