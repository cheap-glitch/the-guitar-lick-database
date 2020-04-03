module.exports = {
	root: true,

	parserOptions: {
		parser: 'babel-eslint'
	},

	plugins: [
		'smarter-tabs',
	],

	env: {
		node: true
	},

	globals: {
		alphaTab: true,
	},

	extends: [
		'eslint:recommended',
		'plugin:vue/essential',
		'plugin:vue/recommended',
	],

	rules: {
		'no-console':  process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

		'no-mixed-spaces-and-tabs':  ['warn', 'smart-tabs'],
		'smarter-tabs/smarter-tabs': 'warn',
	},

	overrides: [{
		files: ['test/*.test.js'],
		env: {
			mocha: true
		}
	}],
}
