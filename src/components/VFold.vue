

<!-- VFold.vue -->


<!--{{{ Pug -->
<template lang="pug">

section.VFold

	h2.VFold__header(@click.left="toggleOpenClose")

		p.VFold__header__title {{ title }}

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

.VFold__header {
	display: flex;
	justify-content: space-between;

	margin-bottom: 20px;
	padding-bottom: 5px;

	font-weight: bold;

	border-bottom: 1px dotted var(--color--ui--border);

	color: var(--color--ui--text--secondary);

	cursor: pointer;
	user-select: none;
}

.VFold__header__title {
	cursor: pointer;
}

.VFold__header__chevron {
	transition: transform 0.2s;

	&.is-flipped {
		transform: rotate(180deg);
	}
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
