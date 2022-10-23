import { relative, sep } from 'path'
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
    for(let relativeDirs of relativeDirsPaths) {
      this.insert(relativeDirs) 
    }
  }

  insert(relativeDirs: Array<string>) {
    debug('insert==>', JSON.stringify(relativeDirs))
    let i = 0
    let parentNode = this.root
    while(i < relativeDirs.length) {
      const dirName = relativeDirs[i]
      const index = parentNode.children.findIndex(node => {
        return node.name == dirName
      })
      if(index != -1) {
        parentNode = parentNode.children[index]
      } else {
        const node = new TreeNode(dirName)
        parentNode.children.push(node)
        parentNode = parentNode.children[0]
      }
      i++
    }
    debug('tree', JSON.stringify(this.root))
  }

  output() {
    
  }
}