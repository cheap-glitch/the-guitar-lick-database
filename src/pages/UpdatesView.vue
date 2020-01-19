

<!-- pages/UpdatesView.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.UpdatesView
	h2.h2 Updates
	section.updates
		UpdatesViewItem(
			v-for="update in updates"
			:key="update.id"

			v-bind="update"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import api             from '@/modules/api'

import UpdatesViewItem from '@/components/UpdatesViewItem'

export default {
	name: 'UpdatesView',

	components: {
		UpdatesViewItem,
	},

	data() {
		return {
			updates: [],
		}
	},

	created()
	{
		api.get('/updates/0', _data => this.updates = _data || []);
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>



</style>
<!--}}}-->
