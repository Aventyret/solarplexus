<img align="right" width="120" height="120" src="https://github.com/Aventyret/solarplexus/blob/master/solarplexus-logo.png?raw=true" style="float:right" />

# Solarplexus

Solarplexus is a Wordpress plugin and developer tool to easily create Gutenberg blocks for creating dynamic and static lists of posts, pages and more.

## Installation & usage

**To use the latest version in a Wordpress project, simply head over to the 📖 [online documentation](https://aventyret.github.io/solarplexus/) 📖 and don't bother with the dev stuff below.**

## Plugin development instructions

1. Clone the repo in the `plugins` folder of a local WP installation
2. `nvm use`
3. `yarn install`
4. `yarn start`
5. Create a custom theme in your WP installation and follow the regular instructions on the Wiki on how to use the plugin.

### Translations

1. Add new translations by running `wp i18n make-pot ./ languages/splx.pot`
2. Open languages/splx-sv_SE.po with Poedit and select "Update from POT file"
3. Translate and save
4. Convert translations to JSON format by running `wp i18n make-json languages/splx-sv_SE.po --no-purge`

More info in the [WP docs](https://developer.wordpress.org/block-editor/how-to-guides/internationalization/)

## Plugin distribution instructions

The plugin is versioned in dist versions here on GitHub.

1. Make sure you have [wp-cli](https://make.wordpress.org/cli/handbook/guides/installing/) and the [dist-archive](https://developer.wordpress.org/cli/commands/dist-archive/) package installed.
2. Update the version according to semver in `package.json`, `README.txt`, and the main plugin entry file `solarplexus.php`
3. `yarn build`
4. `wp dist-archive .` A dist version without dev-only files will be created in the directory above.
5. On [Releases](https://github.com/Aventyret/solarplexus/releases) page, click `Draft a new release`, fill in new version, changes etc, and upload the zip.
6. The `./docs` of the release tag will be published automatically when a release is created.
