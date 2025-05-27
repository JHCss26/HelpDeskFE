import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   base: '/app/',
//   plugins: [react(), tailwindcss()],
// })
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASENAME,
    plugins: [react(), tailwindcss()],
  }
})