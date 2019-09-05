const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const path = require('path')
const { transformFromAst } = require("@babel/core");

module.exports = {
  // 解析ast树
  getAst: path =>{
    const content = fs.readFileSync(path,'utf-8');
    return parser.parse(content,{
      sourceType:'module'
    });
  },
  // 解析依赖项
  getDependecies:(ast,filename) => {
    // console.log(ast,filename)
    const dependecies = {}
        traverse(ast, {
          ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            const newfile = "./" + path.join(dirname, node.source.value);
            dependecies[node.source.value] = newfile;
          }
        });
        return dependecies;
  },
  // 获取解析代码
  getCode: ast => {
    const { code } = transformFromAst(ast, null, { presets: ["@babel/preset-env"] });
    return code;
  }

}