let babel_core = require("babel-core");
const fs = require("fs");
const path = require("path");

let code1 = fs.readFileSync("file1.js", "utf-8");
let code2 = fs.readFileSync("file2.js", "utf-8");
let babelResult1 = babel_core.transform(code1, {
  presets: ["es2015"],
  sourceMap: true,
  filename: path.resolve("file1.js"),
  sourceFileName: path.resolve("file1.js"),
  code: true,
  ast: false
});

let babelResult2 = babel_core.transform(code2, {
  presets: ["es2015"],
  sourceMap: true,
  filename: path.resolve("file2.js"),
  sourceFileName: path.resolve("file2.js"),
  code: true,
  ast: false
});

let commentNoSourcemap = `// no sourcemap for this comment\n`;
let virtual = new Function(
  `${commentNoSourcemap}${babelResult1.code}${babelResult2.code}//# sourceURL=${path.join(
    path.dirname(path.resolve("index.js")),
    "virtual.js"
  )}\n//# sourceMappingURL=${path.join(
    path.dirname(path.resolve("index.js")),
    "virtual.js.map"
  )}`
);

let sourcemap = {
  version: 3,
  file: path.join(path.dirname(path.resolve("index.js")), "virtual.js"),
  sections: [
    {
      offset: {
        line: 0,
        column: commentNoSourcemap.length
      },
      map: babelResult1.map
    },
    {
      offset: {
        line: babelResult1.code.split(/\r\n|\r|\n/).length + 1,
        column: 0
      },
      map: babelResult2.map
    }
  ]
};

fs.writeFileSync("virtual.js.map", JSON.stringify(sourcemap), "utf-8");

virtual();
