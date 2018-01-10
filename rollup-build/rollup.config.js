var async = require('rollup-plugin-async');
export default {
  input: './src/IDBStorage.js',
  output: [
    { file: 'dist/sav-storage.cjs.js', format: 'cjs' },
    { file: 'dist/sav-storage.es.js', format: 'es' }
  ],
  plugins: [
    async()
  ]
};