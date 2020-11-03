# Solarplexus

Solarplexus is a Wordpress plugin and developer tool to easily create Gutenberg blocks for creating dynamic and static lists of posts, pages and more.

📖 [Check out the Wiki for documentation](https://github.com/Aventyret/solarplexus/wiki).

## Development instructions

1. Clone the repo in the `plugins` folder of a local WP installation
2. `nvm use`
3. `yarn install`
4. `yarn start`
5. Create a custom theme in your WP installation and follow the regular instructions on the Wiki on how to use the plugin.

## Distribution instructions

The plugin is not yet public, and is only versioned in dist versions here on GitHub.

1. Make sure you have [wp-cli](https://make.wordpress.org/cli/handbook/guides/installing/) and the [dist-archive](https://developer.wordpress.org/cli/commands/dist-archive/) package installed.
2. Update the version according to semver in `package.json`, `README.txt`, and the main plugin entry file `solarplexus.php`
3. `yarn build`
4. `wp dist-archive .` A dist version without dev-only files will be created in the directory above.
5. On [Releases](https://github.com/Aventyret/solarplexus/releases) page, click `Draft a new release`, fill in new version, changes etc, and upload the zip.
