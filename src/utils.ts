import { extname, resolve, relative } from 'path'
import { blackList, moduleReg } from './config'
import { completionExt } from './fs'
import Tree from './tree'
import { debug } from './log'

export function filterBlackList(files: string[]): string[] {
  return files.filter((file) => {
    return !blackList.includes(file) && !file.startsWith('.')
  })
}

/**
 * @description: is match the import statement
 * @param {string} file
 * @param {string} targetFileName
 * @param {string} fileContent
 */
export function isMatchTargetFile(
  file: string,
  targetFileName: string,
  fileContent: string,
): boolean {
  const MatchResult = fileContent.match(moduleReg) || []

  const rawImportPaths: Array<string> = MatchResult
    .filter(result => result.length)
    .map((result) => {
      return result.match(/['"](.*)['"]/g)?.[0].slice(1, -1) || ''
    }).filter(importPath => importPath.startsWith('.'))

  if (rawImportPaths) {
    for (const item of rawImportPaths) {
      debug('import', JSON.stringify(item))

      let fileName = resolve(file, item)
      fileName = extname(fileName) ? fileName : completionExt(fileName)

      debug('importFilePath', fileName)
      if (fileName === targetFileName)
        return true
    }
  }
  return false
}

export function generateTree(projectFilePath: string, paths: Array<string>): string {
  console.log(paths, projectFilePath)
  // const tree = longestCommonPrefix(paths)
  const ins = new Tree(projectFilePath)

  ins.generateNodeFrom(paths)

  ins.output()
}
/*
finse
  ├── src/demo
  │       ├── bar.ts
  │       ├── foo.ts

*/