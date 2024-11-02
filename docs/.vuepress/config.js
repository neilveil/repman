import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import path from 'path'

export default defineUserConfig({
  title: 'Repman',
  description: 'CLI based multiple git repository tracking & management tool',
  theme: defaultTheme({
    logo: 'logo.png',
    navbar: ['/', '/installation/', '/docs/'],
    lastUpdated: false,
    contributors: false,
  }),
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'logo.png' }],
    ['meta', { name: 'theme-color', content: '#7cb342' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  alias: {
    components: path.resolve(__dirname, 'components')
  },
  port: 5500,
  base: '/repman',
  dest: 'build',
  bundler: viteBundler()
})
