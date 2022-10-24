import { find, getProjectRootDir, getRealPath } from './fs'
import { generateTree } from './utils'
import { debug } from './log'

// interface optionType { [k: string]: any }

export default async function run(args: Array<string>) {
  // console.log(options)
  debug('Run', args[0])
  // success(`\nUser Input => ${args[0]}\n`)
  const targetFileName: string = await getRealPath(args[0])

  const projectFilePath: string = await getProjectRootDir(targetFileName)
  // success(`\nProject File => ${projectFilePath}\n`)

  const filePaths: Array<string> = await find(targetFileName, projectFilePath)

  generateTree(projectFilePath, filePaths, targetFileName)
}
