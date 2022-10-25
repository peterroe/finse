import { findDynamicImports, findStaticImports } from 'mlly'
import strip from 'strip-comments'
import { requireReg } from './config'

function findRequire(code: string): Array<string> {
  return code.match(requireReg) || [] as Array<string>
}

async function findImports(code: string): Promise<Array<string>> {
  const arr = await Promise.all([
    findStaticImports(code),
    findDynamicImports(code),
  ])
  return arr.flat().map(it => it.code)
}

export default async function match(code: string): Promise<Array<string>> {
  const pureCode = strip(code)
  return (await findImports(pureCode)).concat(findRequire(pureCode))
}
