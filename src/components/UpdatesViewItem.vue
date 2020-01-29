

<!-- components/UpdatesViewItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.UpdatesViewItem
	h3.h3 {{ title }}
	p {{ date }}
	article.formatted-text(v-html="parsedContents")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import MarkdownIt             from 'markdown-it'

import { prettifyTypography } from '@/modules/filters'

export default {
	name: 'UpdatesViewItem',

	props: {
		date: {
			type: String,
			required: true,
			validator: v => v.match(/20\d{2}-\d{2}-\d{2}/)
		},
		title: {
			type: String,
			required: true,
		},
		contents: {
			type: String,
			default: '',
		},
	},

	computed: {
		parsedContents()
		{
			return prettifyTypography(this.md.render(this.contents.trim()));
		},
	},

	created()
	{
		this.md = new MarkdownIt({
			breaks:      true,
			typographer: true,
		});
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>



</style>
<!--}}}-->
