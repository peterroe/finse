import some from '~/bar/mode.jsx'

require('../demo/bar/oop')

if (Math.random() > 0.5)
  import('./baz')

console.log(some)
