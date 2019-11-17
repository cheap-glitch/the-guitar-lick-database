

<!-- VSpinner.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.VSpinner
	div.spinner
		for i in [...Array(7).keys()]
			div.spinner__circle

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VSpinner',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

$size: 70px;

.VSpinner {
	position: relative;
	@include center-content;

	@include square($size);
}

.spinner {
	@include square($size/2);

	transform-origin: center;
	animation: spin 1s linear infinite;
}

.spinner__circle {
	@include square(100%);

	position: absolute;
	top: 0;
	left: 0;

	border: 2px solid lightgray;
	border-radius: 50%;

	&:nth-child(2) {
		top:  $size/2 *  0.2;
		left: $size/2 * -0.36;
	}

	&:nth-child(3) {
		top:  $size/2 * -0.2;
		left: $size/2 * -0.36;
	}

	&:nth-child(4) {
		top:  $size/2 * -0.36;
		left: 0;
	}

	&:nth-child(5) {
		top:  $size/2 * -0.2;
		left: $size/2 *  0.36;
	}

	&:nth-child(6) {
		top:  $size/2 *  0.2;
		left: $size/2 *  0.36;
	}

	&:nth-child(7) {
		top:  $size/2 *  0.36;
		left: 0;
	}
}

@keyframes spin {
	from { transform: rotate(  0deg); }
	to   { transform: rotate(359deg); }
}

</style>
<!--}}}-->
