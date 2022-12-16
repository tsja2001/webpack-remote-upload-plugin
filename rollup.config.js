const terser = require('@rollup/plugin-terser')

module.exports = [
  {
    input: './index.js',
    output: {
      format: 'cjs',
      file: './min/index.js',
    },
    plugins: [
      terser({
        toplevel: true,
        mangle: true,
      }),
    ],
  },
]
