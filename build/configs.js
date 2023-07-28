const path = require('path')
const version = process.env.VERSION || require('../package.json').version
const cjs = require('@rollup/plugin-commonjs')
const node = require('@rollup/plugin-node-resolve').nodeResolve
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const livereload = require('rollup-plugin-livereload')
const serve = require('rollup-plugin-server')
const ts = require('rollup-plugin-typescript2')

const banner = `/*!
  * zrouter v${version}
  * (c) ${new Date().getFullYear()} liserl
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  {
    file: resolve('dist/zrouter.js'),
    format: 'umd',
    env: 'development',
  },
  {
    file: resolve('dist/zrouter.min.js'),
    format: 'umd',
    env: 'production',
  },
].map(genConfig)

function genConfig(opts) {
  const config = {
    input: {
      input: opts.input || resolve('src/index.ts'),
      plugins: [
        ts(),
        node(),
        cjs(),
        replace({
          __VERSION__: version,
        }),
      ],
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'ZRouter',
    },
  }

  if (opts.env) {
    config.input.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
      })
    )

    if (opts.env === 'development') {
      config.input.plugins.push(
        livereload(),
        serve({
          open: true,
          port: 12355,
        })
      )
    }
  }

  // if (opts.transpile !== false) {
  //   config.input.plugins.push(buble())
  // }

  return config
}
