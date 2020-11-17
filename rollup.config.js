import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import pkg from "./package.json"

export default {
  input: "src/index.js",
  output: {
    dir: 'lib',
    format: "cjs",
    exports: 'auto'
  },
  external: ["react", "ra-core", "query-string"],
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
  ],
}
