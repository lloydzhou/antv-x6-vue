import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import jsx from "acorn-jsx";
// import less from 'rollup-plugin-less';
import filesize from 'rollup-plugin-filesize'
// import pkg from './package.json'
import buble from 'rollup-plugin-buble'
// import nodeResolve from 'rollup-plugin-node-resolve'
// import optimizeLodashImports from "rollup-plugin-optimize-lodash-imports"
// import commonjs from 'rollup-plugin-commonjs';


export default {
  input: 'src/index.ts',
  output: [{
    name: 'graphin-vue',
    format: 'umd',
    sourcemap: true,
    file: "dist/index.js",
    banner: '// @ts-nocheck\nimport {h} from "vue"\n',
    globals: {
      vue: 'Vue',
      '@antv/x6': 'X6',
      '@antv/x6-vue-shape': 'X6VueShape',
    }
  }],
  plugins: [
    // nodeResolve({
    //   jsnext: true,
    //   main: true,
    //   browser: true
    // }),
    babel({
      // extensions: ['.ts', '.js', '.tsx'],
      // babelHelpers: "bundled",
      runtimeHelpers: true,
      // exclude: 'node_modules/**',
      presets: [
        '@vue/cli-plugin-babel/preset'
      ],
      plugins: [
        "@vue/babel-plugin-jsx",
        "transform-vue-jsx",
        "lodash"
      ]
    }),
    terser(),
    filesize(),
    typescript({
      // tsconfig: false,
      // experimentalDecorators: true,
      // module: 'es2015'
    }),
    // commonjs({
    //   namedExports: {
    //     'node_modules/lodash/lodash.js': [
    //       'omit',
    //     ]
    //   }
    // }),
    vue(),
    // optimizeLodashImports(),
    buble({
      objectAssign: 'Object.assign',
      jsx: 'h'
    }),
  ],
  acornInjectPlugins: [jsx()],
  external: [
    "vue",
    "@antv/x6",
    "@antv/x6-vue-shape"
  ]
}
