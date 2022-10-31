import { cac } from 'cac'
import pkg from '../package.json'
import run from './run'
const cli = cac()

cli.option('--expand', 'Expand collapsed file tree')

cli.option('--link', 'Display the absolute path of the file')

cli.option('--clear', 'Hide excess branches')

cli.option('--ignore', 'Ignore file does not exist errors')

cli.option('--root <dir>', 'Specify the root directory')

cli.command('[filepath]', 'Path of target file').action(run)

cli.help()

cli.version(pkg.version)

cli.parse()
