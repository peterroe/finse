import {  existsSync ,promises as fs } from 'fs'
import { resolve } from 'path'
import { error, debug } from './log'

/**
 * @description: Get the real path of the file
 * @param {string} path
 * @usage getRealPath('./Desktop/1.txt')
 * @return /Users/xxx/Desktop/1.txt
 */
export async function getRealPath(path: string): Promise<string> {
  debug('getRealPath', path)
  try {
    return await fs.realpath(path)
  } catch (e) {
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
  
  const isRootDir  = (path: string) => {
    return path === resolve(path, '../')
  }

  const isProjectRootDir = (path: string) => {
    return existsSync(resolve(path, 'package.json'))
  }

  const getParentDir = (path: string) => {
    return resolve(path, '../')
  }
  do {
    path = getParentDir(path)
  } while(!isRootDir(path) && !isProjectRootDir(path))
  
  debug('getProjectRootDir', `${path}`)
  return path
}