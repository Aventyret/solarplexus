# Introduction

Solarplexus is a plugin aimed at Wordpress developers, specifically designed to help out with a common concept that is often re-invented for every new website - referring to other content on that website. Well known concepts such as a list of the latest posts of a custom post type, or simply a hand picked list of highlighted posts, is not entirely trivial when just using what's offered in Wordpress core.

Solarplexus makes this easy by reading a simple configuration from your theme, and generating Gutenberg blocks ready to be used by the editors without further programming. The plugin is designed to be highly developer-customizable, while still being perfectly usable with some default settings for simpler projects.

It includes support for themes based on the Roots Sage boilerplate.

## Getting Started

1. Download the latest dist version under Assets from the [Releases page](https://github.com/Aventyret/solarplexus/releases) on GitHub (solarplexus.X.X.X.zip), unzip in the `plugins` folder of your Wordpress installation.
2. Go to wp-admin and activate the plugin.

You should now have two new Gutenberg blocks available:

### [Solarplexus]: Latest posts or pages

The editor can use this in a page to show a 2-column grid of either the latest posts or pages, layed out with titles, excerpts and dates on top of the featured images. The editor may choose to show between 2 and 8 posts.

### [Solarplexus]: Hand picked posts and pages

The editor can use this in a page to show a 2-column grid of a maximum of 8 chosen posts and pages, layed out with titles, excerpts and dates on top of the featured images.

Read more about how to customize blocks on the next page.
