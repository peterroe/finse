import c from 'kleur';;

const isDebug = process.env.mode === 'debug'

export function log(content: string) {
  console.log(c.blue().bold(content))
}

export function error(content: string) {
  console.log(c.red().bold(content))
}

export function warn(content: string) {
  console.log(c.yellow().bold(content))
}

export function debug(callee: string = 'Function',content: string) {
  if(!isDebug) return

  console.log(`${c.cyan('Debug')}[${c.blue(callee)}]: ${c.bold().dim(content)}\n`)
}