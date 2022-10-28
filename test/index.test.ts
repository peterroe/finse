import { describe, expect, it } from 'vitest'
import { execa } from 'execa'

describe('finse test', async () => {
  it('should find', async () => {
    const { stdout } = await execa('finse', ['test/demo/bar/oop.ts'])
    expect(stdout).toMatchInlineSnapshot(`
      "
      successful: 

      └─ finse/test/demo

      │   ├─ bar

      │   │   ├─ corge/nacho.vue

      │   │   └─ oop.ts (Your target file)

      │   ├─ foo/sharp.js

      │   └─ thud.tsx
      "
    `)
  })

  it('Not find', async () => {
    const { stdout } = await execa('finse', ['test/demo/bar/no'])
    expect(stdout).toMatchInlineSnapshot('"Can\'t find test/demo/bar/no, please check the file path :("')
  })

  it('Not Expand', async () => {
    const { stdout } = await execa('finse', ['test/demo/bar/mode', '--expand'])
    expect(stdout).toMatchInlineSnapshot(`
      "
      successful: 

      └─ finse

      │   └─ test

      │   │   └─ demo

      │   │   │   ├─ baz.js

      │   │   │   ├─ thud.tsx

      │   │   │   └─ bar

      │   │   │   │   └─ mode.jsx (Your target file)
      "
    `)
  })

  it('Debug mode', async () => {
    const { stdout } = await execa('cross-env', ['mode=debug','finse', 'test/demo/bar/mode', '--root', 'test'])
    expect(stdout).toMatchInlineSnapshot(`
      "Debug[Run]: test/demo/bar/mode
      Debug[getFileRealPath]: test/demo/bar/mode
      Debug[completionExt         ]: test/demo/bar/mode.jsx
      Debug[find]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/mode.jsx /Users/lsh/Desktop/t/packages/finse/test
      Debug[detect ==============>]: /Users/lsh/Desktop/t/packages/finse/test/**
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo
      Debug[detect ==============>]: /Users/lsh/Desktop/t/packages/finse/test/demo/**
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar
      Debug[detect ==============>]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/**
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/corge
      Debug[detect ==============>]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/corge/**
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/corge/nacho.vue
      Debug[aliasResolve ====>    ]: [\\"../oop\\"]
      Debug[import ==>            ]: \\"../oop\\"
      Debug[completionExt         ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/oop.ts
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/mode.jsx
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/oop.ts
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/baz.js
      Debug[aliasResolve ====>    ]: [\\"./thud.tsx\\",\\"./bar/mode.jsx\\"]
      Debug[import ==>            ]: \\"./thud.tsx\\"
      Debug[import ==>            ]: \\"./bar/mode.jsx\\"
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo
      Debug[detect ==============>]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo/**
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo/qux
      Debug[detect ==============>]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo/qux/**
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo/qux/export.ts
      Debug[aliasResolve ====>    ]: [\\"../sharp\\"]
      Debug[import ==>            ]: \\"../sharp\\"
      Debug[completionExt         ]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo/sharp.js
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/foo/sharp.js
      Debug[aliasResolve ====>    ]: [\\"../bar/oop\\"]
      Debug[import ==>            ]: \\"../bar/oop\\"
      Debug[completionExt         ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/oop.ts
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/demo/thud.tsx
      Debug[aliasResolve ====>    ]: [\\"~/bar/mode.jsx\\",\\"./baz\\",\\"../demo/bar/oop\\"]
      Debug[import ==>            ]: \\"~/bar/mode.jsx\\"
      Debug[import ==>            ]: \\"./baz\\"
      Debug[completionExt         ]: /Users/lsh/Desktop/t/packages/finse/test/demo/baz.js
      Debug[import ==>            ]: \\"../demo/bar/oop\\"
      Debug[completionExt         ]: /Users/lsh/Desktop/t/packages/finse/test/demo/bar/oop.ts
      Debug[detect ============>  ]: /Users/lsh/Desktop/t/packages/finse/test/index.test.ts
      Debug[rootName]: test
      Debug[insert==>]: [\\"demo\\",\\"baz.js\\"]
      Debug[tree]: {\\"name\\":\\"test\\",\\"children\\":[{\\"name\\":\\"demo\\",\\"children\\":[{\\"name\\":\\"baz.js\\",\\"children\\":[],\\"isTarget\\":false,\\"linkPath\\":\\"/Users/lsh/Desktop/t/packages/finse/test/demo/baz.js\\"}],\\"isTarget\\":false,\\"linkPath\\":\\"/Users/lsh/Desktop/t/packages/finse/test/demo/baz.js\\"}],\\"isTarget\\":false,\\"linkPath\\":\\"\\"}
      Debug[insert==>]: [\\"demo\\",\\"bar\\",\\"mode.jsx\\"]
      Debug[tree]: {\\"name\\":\\"test\\",\\"children\\":[{\\"name\\":\\"demo\\",\\"children\\":[{\\"name\\":\\"baz.js\\",\\"children\\":[],\\"isTarget\\":false,\\"linkPath\\":\\"/Users/lsh/Desktop/t/packages/finse/test/demo/baz.js\\"},{\\"name\\":\\"bar\\",\\"children\\":[{\\"name\\":\\"mode.jsx\\",\\"children\\":[],\\"isTarget\\":true,\\"linkPath\\":\\"\\"}],\\"isTarget\\":true,\\"linkPath\\":\\"\\"}],\\"isTarget\\":false,\\"linkPath\\":\\"/Users/lsh/Desktop/t/packages/finse/test/demo/baz.js\\"}],\\"isTarget\\":false,\\"linkPath\\":\\"\\"}

      successful: 

      └─ test/demo

      │   ├─ baz.js

      │   └─ bar/mode.jsx (Your target file)
      "
    `)
  })
})
