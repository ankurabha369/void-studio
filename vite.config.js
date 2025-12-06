import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindConfig from './tailwind.config.js'

// https://vite.dev/config/
export default defineConfig({
  // CORRECT LOCATION: This tells VITE where the assets should load from
  base: '/void-studio/',

  plugins: [
    react({
      babel: {
        // Only Babel-specific plugins/options should be here
        plugins: [['babel-plugin-react-compiler', { tailwindConfig }]],
      },
    }),
  ],
})
