
const path = require("path");
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: {
      //'main-menu': './src/main-menu.js',
      //'in-game': './src/in-game.js',
      'index': './src/index.js',
      //'loading': './src/loading.js',
  },
  output: {
      path: __dirname + '-dist',
      filename: '[name].js' // output: abc.js, cde.js
  },
  plugins: [
      new JavaScriptObfuscator({
        compact: true,
        controlFlowFlattening: false,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: false,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        domainLock: [],
        identifierNamesGenerator: 'hexadecimal',
        identifiersDictionary: [],
        identifiersPrefix: '',
        inputFileName: '',
        log: false,
        renameGlobals: true,
        reservedNames: [],
        reservedStrings: [],
        rotateStringArray: true,
        seed: 0,
        selfDefending: false,
        shuffleStringArray: true,
        sourceMap: false,
        sourceMapBaseUrl: '',
        sourceMapFileName: '',
        sourceMapMode: 'separate',
        splitStrings: false,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayEncoding: false,
        stringArrayThreshold: 0.75,
        target: 'browser',
        transformObjectKeys: true,
        unicodeEscapeSequence: false
      })
  ]
};
