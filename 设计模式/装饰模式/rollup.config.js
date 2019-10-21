const babel = require('rollup-plugin-babel')
import commonjs from 'rollup-plugin-commonjs'
export default {
  sourceMap:true,
  entry: './log.js',
  targets: [
    { dest: './app.js', format: 'umd' },
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      'presets': [
        'stage-0',
        'react'
      ],
      'plugins': [
        'external-helpers',
        "transform-decorators-legacy"
      ]
    }),
    commonjs()
  ],
  onwarn (msg) {
    if (msg && msg.startsWith('Treating')) {
      return
    }
  }
}
