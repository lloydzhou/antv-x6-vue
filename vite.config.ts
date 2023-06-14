import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: './src/*.ts',
      fileName: (format) => `[name].${format == 'es' ? 'js' : format}`,
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      input: {
        index: "./src/index.ts",
      },
      external: [
        "vue",
        "@antv/x6",
        "@antv/x6-plugin-clipboard",
        "@antv/x6-plugin-dnd",
        "@antv/x6-plugin-keyboard",
        "@antv/x6-plugin-minimap",
        "@antv/x6-plugin-scroller",
        "@antv/x6-plugin-selection",
        "@antv/x6-plugin-snapline",
        "@antv/x6-plugin-stencil",
        "x6-html-shape",
        "resize-detector"
      ],
      output: {
        globals: {
          "core-js": 'CoreJS',
          vue: 'Vue',
          '@antv/x6': 'X6',
          "@antv/x6-plugin-clipboard": "Clipboard",
          "@antv/x6-plugin-dnd": "Dnd",
          "@antv/x6-plugin-keyboard": "Keyboard",
          "@antv/x6-plugin-minimap": "MiniMap",
          "@antv/x6-plugin-scroller": "Scroller",
          "@antv/x6-plugin-selection": "Selection",
          "@antv/x6-plugin-snapline": "Snapline",
          "@antv/x6-plugin-stencil": "Stencil",
          "x6-html-shape": "HTMLShape",
          "resize-detector": "ResizeDetector"
        }
      }
    }
  }
})
