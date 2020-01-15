module.exports = {
	root: true,

	parserOptions: {
		parser: 'babel-eslint'
	},

	env: {
		node: true
	},

	extends: [
		'eslint:recommended',
		'plugin:vue/essential',
		'plugin:vue/recommended',
	],

	plugins: [
		'smarter-tabs',
	],

	globals: {
		'alphaTab': true,
	},

	rules: {
		'no-console':  process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

		'no-mixed-spaces-and-tabs':   ['warn', 'smart-tabs'],
		'smarter-tabs/smarter-tabs':  'warn',
	},

	overrides: [{
		files: ['**/__tests__/*.{j,t}s?(x)'],
		env: {
			mocha: true
		}
	}],
}
