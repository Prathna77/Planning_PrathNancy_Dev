import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: "Planning_PrathNancy_Dev",
  plugins: [react()],
  server: { host: true }
})
