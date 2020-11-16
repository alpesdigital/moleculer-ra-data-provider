export default {
  input: 'src/index.js',
  output: {
    format: 'cjs',
    file: 'lib/index.js',
    exports: 'default',
  },
  external:  [ 'ra-core', 'query-string' ]
};
