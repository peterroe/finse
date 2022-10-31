import { find, getFileRealPath, getProjectRootDir, getRealPath } from './fs'
import { generateTree } from './utils'
import { debug } from './log'

interface optionType {
  '--': Array<any>
  expand?: boolean
  root?: string
  link?: boolean
  clear?: boolean
  ignore?: boolean
}

export default async function run(filepath: string, options: optionType) {
  global.options = options

  const { root } = options
  debug('Run', filepath)

  const targetFileName: string = await getFileRealPath(filepath)

  const projectFilePath: string = (root && await getRealPath(root)) || await getProjectRootDir(targetFileName)

  const filePaths: Array<string> = await find(targetFileName, projectFilePath)

  generateTree(projectFilePath, filePaths, targetFileName)
}
