<img src="./logo.svg" />

## Why

* It's hard to find where this file is used

* Search in IDEA is not enough

## What

* A cli tool to find where this file is used

## How

```js
import xx from './test/index.js'
import xx from './test'
import xx from '.'
import '../../foo.ts'
export * from './test'

// import xx from '~/test'
// import xx from '@/test'
// monorepo 'hhjh/kjhh'

const x =  require('./test/index.js')
const x = require('./test')

```

## Flow

```shell
$ find-use ./test/index.js
```

* find root dir: '.git'


## extensions

```js
['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
```