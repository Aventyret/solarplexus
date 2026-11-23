import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/solarplexus/',
  title: 'Solarplexus',
  description:
    'A list block builder for the Wordpress Gutenberg editor.',
  appearance: false,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/solarplexus/solarplexus-logo.svg' }]
  ],
  themeConfig: {
    logo: '/solarplexus-logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Aventyret/solarplexus' }
    ],

    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2021-present Äventyret'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Contribute', link: '/contribute/' },
      {
        text: 'Releases',
        link: 'https://github.com/Aventyret/solarplexus/releases'
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Getting Started',
              link: '/guide/'
            },
            {
              text: 'Configuration',
              link: '/guide/config'
            },
            {
              text: 'Templating',
              link: '/guide/templating'
            },
            {
              text: 'Advanced Customization',
              link: '/guide/customization'
            }
          ]
        }
      ]
    }
  }
})
