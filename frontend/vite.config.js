import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Menggunakan absolute path agar sub-halaman (seperti /admin) bisa menemukan aset
})
