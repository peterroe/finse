import { extname, relative, sep } from 'path'
import c from 'kleur'
import { debug } from './log'

type LogFn<T> = (o: T) => string

const logSpace: LogFn<number> = (d: number) => {
  const char = global.options?.clear ? ' ' : '│'
  return (`${char}   `).repeat(d)
}

const logPrefix: LogFn<boolean> = (f: boolean) => {
  return f ? '└─ ' : '├─ '
}

const logName: LogFn<TreeNode> = ({ name, isTarget, linkPath }) => {
  const targetFileStr = `${c.bgYellow(name)} (Your target file)`

  const matchFileStr = global.options?.link ? `${c.bgCyan(name)} ${c.dim(linkPath)}` : c.bgCyan(name)

  if (isTarget && extname(name))
    return targetFileStr
  return extname(name) ? matchFileStr : name
}

class TreeNode {
  name: string
  children: Array<TreeNode>
  isTarget: boolean
  linkPath: string

  constructor(name: string, children?: Array<TreeNode>, isTarget?: boolean, linkPath?: string) {
    this.name = name
    this.children = children || []
    this.isTarget = isTarget || false
    this.linkPath = linkPath || ''
  }
}

export default class Tree {
  treeName: string
  root: TreeNode

  constructor(treeName: string) {
    this.treeName = treeName
    this.root = this.generateRoot(treeName)
  }

  generateRoot(treeName: string) {
    const dirs = treeName.split(sep)
    const rootName = dirs[dirs.length - 1]
    debug('rootName', rootName)
    return new TreeNode(rootName)
  }

  generateNodeFrom(paths: Array<string>) {
    const relativeDirsPaths: Array<Array<string>> = paths.map(path => relative(this.treeName, path).split(sep))

    for (let i = 0; i < relativeDirsPaths.length; i++)
      this.insert(relativeDirsPaths[i], false, paths[i])
  }

  insert(relativeDirs: Array<string>, isTarget = false, linkPath?: string) {
    debug('insert==>', JSON.stringify(relativeDirs))
    let i = 0
    let parentNode = this.root
    while (i < relativeDirs.length) {
      const dirName = relativeDirs[i]
      const index = parentNode.children.findIndex((node) => {
        return node.name === dirName
      })
      if (index !== -1) {
        parentNode = parentNode.children[index]
      }
      else {
        const node = new TreeNode(dirName, [], isTarget, linkPath)
        const len = parentNode.children.push(node)
        parentNode = parentNode.children[len - 1]
      }
      i++
    }
    debug('tree', JSON.stringify(this.root))
  }

  insertTarget(targetFileName: string) {
    const relativeDirs = relative(this.treeName, targetFileName).split(sep)
    this.insert(relativeDirs, true)
  }

  foldDir() {
    const dfs = (node: TreeNode) => {
      while (node.children.length === 1) {
        const next = node.children[0]
        node.name = `${node.name}/${next.name}`
        node.children = next.children
      }
      for (let i = 0; i < node.children.length; i++) {
        const no = node.children[i]
        if (no)
          dfs(no)
      }
    }
    dfs(this.root)
  }

  output() {
    console.log(c.cyan('\nsuccessful: \n'))
    const dfs = (node: TreeNode, d: number, flag: boolean) => {
      console.log(`${logSpace(d) + logPrefix(flag) + logName(node)}\n`)
      for (let i = 0; i < node.children.length; i++) {
        const no = node.children[i]
        if (no)
          dfs(no, d + 1, i === node.children.length - 1)
      }
    }
    dfs(this.root, 0, true)
    // console.log(c.cyan(' ======end======'))
  }
}
