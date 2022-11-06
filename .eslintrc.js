module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error'],
		'react/prop-types': 0,
		'react/react-in-jsx-scope': 0,
		'react/display-name': 0,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
