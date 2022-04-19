import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import jsx from "acorn-jsx";
import less from 'rollup-plugin-less';
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
    file: "dist/index.js",
    banner: '// @ts-nocheck\nimport {h} from "vue"\n',
  }, {
    format: 'es',
    file: "dist/index.es.js",
    banner: '// @ts-nocheck\nimport {h} from "vue"\n',
  }],
  plugins: [
    less({
      output: 'dist/index.css'
    }),
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
    "@antv/g6",
    "lodash",
  ]
}
