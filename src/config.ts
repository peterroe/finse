// import { fileURLToPath } from 'url'
// import { dirname } from 'path'
// const __filename = fileURLToPath(import.meta.url)

// export const __dirname = dirname(__filename)

export const extensions = ['/index.ts', '/index.js', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '/index.vue']

export const pureExtensions = extensions.filter(ext => ext.startsWith('.'))

export const blackList = [
  'dist',
  'node_modules',
  'coverage',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'README.md',
  'LICENSE',
]

export const moduleReg = /(import|export)\s+.*\s+from\s+['"](.*)['"]|require\(['"](.*)['"]\)|import\(['"](.*)['"]\)|import\s+['"](.*)['"]/g

export const requireReg = /export\s+.*\s+from\s+['"](.*)['"]|require\(['"](.*)['"]\)/g

