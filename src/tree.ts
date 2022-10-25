import { extname, relative, sep } from 'path'
import c from 'kleur'
import { debug } from './log'

type LogFn<T> = (o: T) => string

const logPrefix: LogFn<boolean> = (f: boolean) => {
  return f ? '└─' : '├─'
}

const logName: LogFn<TreeNode> = ({ name, isTarget }) => {
  if (isTarget && extname(name))
    return `${c.bgYellow(name)} (Your target file)`
  return extname(name) ? c.bgCyan(name) : name
}

class TreeNode {
  name: string
  children: Array<TreeNode>
  isTarget: boolean

  constructor(name: string, children?: Array<TreeNode>, isTarget?: boolean) {
    this.name = name
    this.children = children || []
    this.isTarget = isTarget || false
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
    for (const relativeDirs of relativeDirsPaths)
      this.insert(relativeDirs)
  }

  insert(relativeDirs: Array<string>, isTarget = false) {
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
        const node = new TreeNode(dirName, [], isTarget)
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
      while(node.children.length === 1) {
        let next = node.children[0]
        node.name = node.name + '/' + next.name
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
      console.log(`${'    '.repeat(d) + logPrefix(flag) + logName(node)}\n`)
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
