import { existsSync, promises as fs } from 'fs'
import { extname, join, resolve } from 'path'
import { filterBlackList, isMatchTargetFile } from './utils'
import { debug, error, success } from './log'
import { extensions } from './config'

type pathFn<T> = (path: string) => T

const isRootDir: pathFn<boolean> = (path: string) => {
  return path === resolve(path, '../')
}

const isProjectRootDir: pathFn<boolean> = (path: string) => {
  return existsSync(resolve(path, 'package.json'))
}

const isDirectory: pathFn<Promise<boolean>> = async (path: string) => {
  const stat = await fs.stat(path)
  return stat.isDirectory()
}

const getParentDir: pathFn<string> = (path: string) => {
  return resolve(path, '../')
}

export const completionExt: pathFn<string> = (path: string) => {
  for (const ext of extensions) {
    if (existsSync(path + ext)) {
      path += ext
      debug('completionExt', path)
      return path
    }
  }
  error(`Can't find ${path} :(`)
  process.exit(0)
}

/**
 * @description: Get the real path of the file
 * @param {string} path
 * @usage getRealPath('./Desktop/1.txt')
 * @return /Users/xxx/Desktop/1.txt
 */
export async function getRealPath(path: string): Promise<string> {
  debug('getRealPath', path)
  if (extname(path)) {
    try {
      return await fs.realpath(path)
    }
    catch (e) {
      error('File not found, please check the path :(')
      process.exit(0)
    }
  }
  else {
    // debug('getRealPath', JSON.parse(parse(path))
    return await completionExt(path)
  }
}

/**
 * @description: Get the root directory of the project
 * @param {string} path
 * @usage getProjectRootDir('/Users/xxx/Desktop/1.txt')
 * @return /Users/xxx
 */
export async function getProjectRootDir(path: string): Promise<string> {
  do
    path = getParentDir(path)
  while (!isRootDir(path) && !isProjectRootDir(path))

  debug('getProjectRootDir', `${path}`)
  return path
}

export async function find(
  targetFileName: string, 
  projectFilePath: string
): Promise<Array<string>> {
  debug('find', `${targetFileName} ${projectFilePath}`)
  const result: Array<string> = []
  const dfs = async (dirname: string) => {
    const files = filterBlackList(
      await fs.readdir(dirname),
    ).map(file => join(dirname, file))

    for (const file of files) {
      debug('detect =====>', file)
      if (await isDirectory(file)) { await dfs(file) }
      else {
        const fileContent = await fs.readFile(file, 'utf-8')
        const isInclude = isMatchTargetFile(
          resolve(file, '../'),
          targetFileName,
          fileContent,
        )
        if (isInclude) {
          result.push(file)
          success(`Find in ${file}`)
        }
      }
    }
  }
  await dfs(projectFilePath)
  return result
}
