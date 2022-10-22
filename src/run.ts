import { find, getProjectRootDir, getRealPath } from './fs'
import { debug, success } from './log'

interface optionType { [k: string]: any }

export default async function run(args: Array<string>, options: optionType) {
  console.log(options)
  debug('Run', args[0])
  success(`\nUser Input => ${args[0]}\n`)
  const targetFileName = await getRealPath(args[0])

  const projectFilePath = await getProjectRootDir(targetFileName)
  success(`\nProject File => ${projectFilePath}\n`)

  find(targetFileName, projectFilePath)
}
