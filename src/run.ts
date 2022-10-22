import { getRealPath, getProjectRootDir } from './fs';
import { log } from './log';

interface optionType { [k: string]: any }

export default async function run(args: Array<string>, options: optionType) {
  console.log({ args, options })
  // console.log(path.resolve(args[0]))
  const targetFileName = await getRealPath(args[0])

  const projectFileName = await getProjectRootDir(targetFileName)
  log(targetFileName)
  // log(projectFileName)
}