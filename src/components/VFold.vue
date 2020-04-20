

<!-- VFold.vue -->


<!--{{{ Pug -->
<template lang="pug">

section.VFold
	h2.VFold__header(@click.left="toggleOpenClose")
		p {{ title }}
		fa-icon.VFold__header__chevron(
			:icon="['far', 'chevron-down']"
			v-mods="{ isFlipped: !isOpened }"
			)

	transition(name="fade")
		div.VFold__content(v-show="isOpened")
			slot

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import storage from '@/modules/storage'

export default {
	name: 'VFold',

	props: {
		title: {
			type: String,
			required: true,
		},
		isClosedByDefault: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpened: storage.get(this.getStorageKeyName(), !this.isClosedByDefault, v => typeof v == 'boolean'),
		}
	},

	methods: {
		toggleOpenClose()
		{
			storage.set(this.getStorageKeyName(), this.isOpened = !this.isOpened);
		},
		getStorageKeyName()
		{
			return `fold/${this.title.replace(' ', '-').toLowerCase()}`;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/transitions' as *;

.VFold__header {
	display: flex;
	justify-content: space-between;

	margin-bottom: 15px;
	padding-bottom: 10px;

	font-weight: bold;

	border-bottom: 1px solid var(--color--ui--border);

	color: var(--color--ui--text-2);

	cursor: pointer;
	user-select: none;
}

.VFold__header__chevron {
	@include flip();
}

</style>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss">

.VFold__content {
	@include space-children-v(10px);
}

</style>
<!--}}}-->
