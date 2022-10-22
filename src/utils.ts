import { blackList } from './config'

export function filterBlackList(files: string[]): string[] {
  return files.filter((file) => {
    return !blackList.includes(file) && !file.startsWith('.')
  })
}
