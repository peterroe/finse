import { existsSync, promises as fs } from 'fs'
import { extname, join, resolve } from 'path'
import { filterBlackList, getEffectiveExt, isMatchTargetFile, safeParse } from './utils'
import { debug, error } from './log'
import { extensions, pureExtensions } from './config'

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
      debug('completionExt         ', path)
      return path
    }
  }
  error(`Can't find ${path}(${pureExtensions}) :(`)
  process.exit(0)
}

/**
 * @description: Get the real path of the file
 * @param {string} path
 * @usage getRealPath('./Desktop/1.txt')
 * @return /Users/xxx/Desktop/1.txt
 */
export async function getFileRealPath(path: string): Promise<string> {
  debug('getFileRealPath', path)
  if (!extname(path)) {
    // debug('getRealPath', JSON.parse(parse(path))
    path = await completionExt(path)
  }
  return await getRealPath(path)
}

export async function getRealPath(path: string): Promise<string> {
  try {
    return await fs.realpath(path)
  }
  catch (e) {
    error('File not found, please check the path :(')
    process.exit(0)
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
  projectFilePath: string,
): Promise<Array<string>> {
  debug('find', `${targetFileName} ${projectFilePath}`)
  const result: Array<string> = []
  const dfs = async (dirname: string) => {
    const files = filterBlackList(
      await fs.readdir(dirname),
    ).map(file => join(dirname, file))

    debug('detect ==============>', `${dirname}/**`)
    for (const file of files) {
      debug('detect ============>  ', file)
      if (await isDirectory(file)) { await dfs(file) }
      else {
        const fileContent = await fs.readFile(file, 'utf-8')
        const isInclude = await isMatchTargetFile(
          resolve(file, '../'),
          targetFileName,
          fileContent,
          projectFilePath,
        )

        if (isInclude)
          result.push(file)
      }
    }
  }
  await dfs(projectFilePath)
  return result
}

interface PathsConfig {
  [k: string]: Array<string>
}

// https://www.tslang.cn/docs/handbook/module-resolution.html
function pathReplace(
  rawImportPaths: Array<string>,
  paths: PathsConfig,
  baseUrl: string,
  projectFilePath: string,
) {
  const pathsKey = Object.keys(paths)
  debug('beforePathResolve     ', JSON.stringify(rawImportPaths))

  for (let i = 0; i < rawImportPaths.length; i++) {
    for (const key of pathsKey) {
      if (!key.includes('*'))
        continue

      const name
        = rawImportPaths[i].match(
          new RegExp(key.replace('*', '(?<name>.*)')),
        )?.groups?.name || ''

      if (name) {
        const pathsValue = paths[key]
        for (let k = 0; k < pathsValue.length; k++) {
          const realPath = pathsValue[k].replace('*', name)
          console.log({realPath})
          const fullPath = getEffectiveExt(resolve(projectFilePath, baseUrl, realPath))
          console.log({fullPath})
          if (existsSync(fullPath))
            rawImportPaths[i] = fullPath
        }
      }
    }
  }
  debug('afterPathResolve      ', JSON.stringify(rawImportPaths))
}

export async function aliasResolve(rawImportPaths: Array<string>, projectFilePath: string): Promise<Array<string>> {
  debug('aliasResolve ====>    ', JSON.stringify(rawImportPaths))
  const tsconfig = resolve(projectFilePath, 'tsconfig.json')
  if (!existsSync(tsconfig))
    return rawImportPaths

  const content = await fs.readFile(tsconfig, 'utf-8')

  const o = safeParse(content)
  const {
    paths = o.paths,
    baseUrl = '.',
  }: { paths: PathsConfig; baseUrl: string }
  = o.compilerOptions || {}
  // const path = JSON.parse(content)
  // console.log({paths})
  // console.log(content)
  if (!paths)
    return rawImportPaths

  pathReplace(rawImportPaths, paths, baseUrl, projectFilePath)

  return rawImportPaths
}

