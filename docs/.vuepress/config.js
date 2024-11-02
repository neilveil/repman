import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import path from 'path'

export default defineUserConfig({
  title: 'Repman',
  description: 'CLI based multiple git repository tracking & management tool',
  theme: defaultTheme({
    logo: 'logo.png',
    navbar: ['/', '/installation/', '/docs/']
  }),
  alias: {
    components: path.resolve(__dirname, 'components')
  },
  port: 5000,
  dest: 'build',
  bundler: viteBundler()
})
