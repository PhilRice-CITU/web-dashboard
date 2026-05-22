import { defineConfig, configDefaults } from 'vitest/config'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
        providerImportSource: '@mdx-js/react',
      }),
    },
    viteReact({ include: /\.(mdx|md|js|jsx|ts|tsx)$/ }),
  ],
  // Vitest: unit tests live in src/; e2e/ is Playwright-only.
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})

export default config
