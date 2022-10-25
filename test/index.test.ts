import { describe, expect, it } from 'vitest'
import { execa } from 'execa'

describe('finse test', async () => {
  it('should find', async () => {
    const { stdout } = await execa('finse', ['test/demo/bar/oop.ts'])
    expect(stdout).toMatchInlineSnapshot(`
      "
      successful: 

      └─finse/test/demo

          ├─bar

              ├─corge/nacho.vue

              └─oop.ts (Your target file)

          ├─foo/sharp.js

          └─thud.tsx
      "
    `)
  })

  it('Not find', async () => {
    const { stdout } = await execa('finse', ['test/demo/bar/mode'])
    expect(stdout).toMatchInlineSnapshot(`
      "
      successful: 

      └─finse/test/demo

          ├─thud.tsx

          └─bar/mode.jsx (Your target file)
      "
    `)
  })
})
