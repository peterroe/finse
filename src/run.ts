import { find, getProjectRootDir, getRealPath, getFileRealPath } from './fs'
import { generateTree } from './utils'
import { debug, success } from './log'

interface optionType { [k: string]: any }

export default async function run(args: Array<string>, options: optionType) {
  // console.log(options)
  const { root } = options
  debug('Run', args[0])
  success(`\nUser Input => ${args[0]}\n`)
  const targetFileName: string = await getFileRealPath(args[0])

  const projectFilePath: string = await getRealPath(root) || await getProjectRootDir(targetFileName)

  const filePaths: Array<string> = await find(targetFileName, projectFilePath)

  generateTree(projectFilePath, filePaths, targetFileName)
}
