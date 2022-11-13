export const extensions = ['/index.ts', '/index.js', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '/index.vue']

export const pureExtensions = extensions.filter(ext => ext.startsWith('.'))

export const blackList = [
  'dist',
  'node_modules',
  'coverage',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'LICENSE',
  '*.tgz',
  '*.md',
  '*.log',
  '.*',
]

export const moduleReg = /(import|export)\s+.*\s+from\s+['"](.*)['"]|require\(['"](.*)['"]\)|import\(['"](.*)['"]\)|import\s+['"](.*)['"]/g

export const requireReg = /export\s+.*\s+from\s+['"](.*)['"]|require\(['"](.*)['"]\)/g

