import { cac } from 'cac'
import pkg from '../package.json'
import run from './run'
const cli = cac()

cli.option('--root <dir>', 'your root dir')

cli.command('[...args]', 'find files').action(run)

cli.help()

cli.version(pkg.version)

cli.parse()
