(function(graph){
      function require(module){
        function localRequire(relativePath){
          return require(graph[module].dependecies[relativePath])
        }
        var exports = {};
        (function(require,exports,code){
          eval(code)
        })(localRequire,exports,graph[module].code);
        return exports;
      }
      require('./src/index.js')
    })({"./src/index.js":{"dependecies":{"./say.js":"./src\\say.js"},"code":"\"use strict\";\n\nvar _say = _interopRequireDefault(require(\"./say.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n(0, _say[\"default\"])('webpack');"},"./src\\say.js":{"dependecies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = say;\n\nfunction say(name) {\n  // return 'hello' + name\n  // document.write(('hello' + name))\n  document.write('hello' + name);\n}"}})