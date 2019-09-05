// 引入 node 中的读写文件方法
const fs = require("fs");
// 引入 node中的path方法
const path = require('path')
// 引入编译模板的 parser的方法
const { getAst, getDependecies,getCode} = require('./parser.js')
// 编写 complier 类  实现 编译
module.exports = class Complier {
  // 导入的参数 进行本地赋值
  constructor(options){
    const { entry, output} = options
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  // 执行方法
  run(){
    // 处理构建后的信息
    const info = this.build(this.entry)

    this.modules.push(info)
    // 遍历 收集信息
    for(let i=0, l= this.modules.length; i < l; i++){
      const item = this.modules[i];
      // 取出依赖项
      const { dependecies } = item
      // 如果有依赖项 将它重新处理
      if(dependecies){
        for(let j in dependecies){
          this.modules.push(this.build(dependecies[j]));
        }
      }
    }
    // 重新处理依赖项
    const obj = {}
    this.modules.forEach(item => {
      obj[item.filename] = {
        dependecies:item.dependecies,
        code:item.code
      }
    })
    this.file(obj)
  }
  // build 构建方法
  build(filename){
    let ast = getAst(filename);
    let dependecies = getDependecies(ast,filename);
    let code = getCode(ast);
    return {
      filename,
      dependecies,
      code
    };
  }
  // file 文件读写 方法
  file(code){
    console.log(code)
    const filePath = path.join(this.output.path,this.output.filename)
    const newCode = JSON.stringify(code)
    const bundle = `(function(graph){
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
      require('${this.entry}')
    })(${newCode})`;

      fs.writeFileSync(filePath, bundle, "utf-8");
  }
}