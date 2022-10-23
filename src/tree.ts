import { extname, relative, sep } from 'path'
import c from 'kleur'
import { debug } from './log'

class TreeNode {
  name: string
  children: Array<TreeNode>

  constructor(name: string, children?: Array<TreeNode>) {
    this.name = name
    this.children = children || []
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

  insert(relativeDirs: Array<string>) {
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
        const node = new TreeNode(dirName)
        const len = parentNode.children.push(node)
        parentNode = parentNode.children[len - 1]
      }
      i++
    }
    debug('tree', JSON.stringify(this.root))
  }

  output() {
    const logName = (name: string) => {
      return extname(name) ? c.bgCyan(name) : name
    }
    const logPrefix = (f: boolean) => {
      return f ? '└─' : '├─'
    }
    console.log(c.cyan('\nsuccessful: \n'))
    const dfs = (node: TreeNode, d: number, flag: boolean) => {
      console.log(`${'    '.repeat(d) + logPrefix(flag) + logName(node.name)}\n`)
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
