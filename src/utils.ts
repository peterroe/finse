import { extname, resolve } from 'path'
import { blackList } from './config'
import { completionExt, aliasResolve } from './fs'
import Tree from './tree'
import match from './match'
import { debug, warn } from './log'

export function getEffectiveExt(fileName: string) {
  const ext = extname(fileName)
  if (!ext || ext === '.config')
    return completionExt(fileName)
  else
    return fileName
}

function filterLocalPath(importPath: string) {
  // return false
  return importPath.startsWith('.')
    || /^\W+\/.*/.test(importPath)
}

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
export async function isMatchTargetFile(
  file: string,
  targetFileName: string,
  fileContent: string,
  projectFilePath: string
): Promise<boolean> {
  // ['import xx from "xx", ]
  const matchResult = await match(fileContent)

  // ["xx", ]
  let rawImportPaths: Array<string> = matchResult
    .filter(result => result.length)
    .map((result) => {
      return result.match(/['"](.*)['"]/g)?.[0].slice(1, -1) || ''
      // ignore npm package
    }).filter(filterLocalPath)
  
  if (rawImportPaths.length) {
    rawImportPaths = await aliasResolve(rawImportPaths, projectFilePath)
    
    for (const item of rawImportPaths) {
      debug('import ==>            ', JSON.stringify(item))

      let fileName = resolve(file, item)
      fileName = getEffectiveExt(fileName)

      if (fileName === targetFileName)
        return true
    }
  }
  return false
}

export function generateTree(projectFilePath: string, paths: Array<string>, targetFileName: string) {
  
  if(!paths.length) {
    warn("No file was found")
    return
  }

  const ins = new Tree(projectFilePath)

  ins.generateNodeFrom(paths)

  ins.insertTarget(targetFileName)

  ins.output()
}

export function safeParse(json: string) {
  try {
    return JSON.parse(json)
  } catch {
    warn('tsconfig.json parse error')
  }
  return {}
}