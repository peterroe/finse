import c from 'kleur'

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

export function success(content: string) {
  console.log(c.green().bold(content))
}

export function dim(content: string) {
  console.log(c.dim(content))
}

export function debug(callee = 'Function', content: string) {
  if (!isDebug)
    return

  console.log(`${c.cyan('Debug')}[${c.blue(callee)}]: ${c.bold().dim(content)}`)
}
