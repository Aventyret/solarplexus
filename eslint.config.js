const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
	js.configs.recommended,
	react.configs.flat.recommended,
	prettierConfig,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: 'module',
			globals: globals.browser,
		},
		plugins: { prettier: prettierPlugin },
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
	},
];
