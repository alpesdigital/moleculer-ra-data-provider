export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    file: 'lib/index.js',
  },
  external:  [ 'ra-core', 'query-string' ]
};
