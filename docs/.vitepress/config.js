import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/solarplexus/',
  title: 'Solarplexus',
  description:
    'A list block builder for the Wordpress Gutenberg editor.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/solarplexus-logo.svg' }]
  ],
  themeConfig: {
    repo: 'Aventyret/solarplexus',
    logo: '/solarplexus-logo.svg',

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
      '/contribute/': 'auto',
      '/': [
        {
          text: 'Guide',
          children: [
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
