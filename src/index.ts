import { cac } from 'cac'
import pkg from '../package.json'
const cli = cac()
import run from './run'

cli.command('[...args]', 'find files').action(run)

cli.help()

cli.version(pkg.version)

cli.parse()
