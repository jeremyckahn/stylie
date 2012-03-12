var requirejs = require('requirejs');
var fs = require('fs');
var exec = require('child_process').exec;
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var config = {
  baseUrl: './',
  name: 'src/init',
  out: 'dist/app.js',
  libOut: 'dist/libs.js'
};

requirejs.optimize(config, function (buildResponse) {
  //buildResponse is just a text output of the modules
  //included. Load the built file for the contents.
  //Use config.out to get the optimized file contents.
  var contents = fs.readFileSync(config.out, 'utf8');
});

fs.readFile('index.html', function(err,data){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }

  var html = data.toString();
  var libs = html.match(/lib\/[^\.]*\.js/g);
  var command = 'cat ' + libs.join(' ') + ' > ' + config.libOut;
  exec(command, function (error, stdout, stderr) {
    fs.readFile(config.libOut, function (err, data) {
      var libCode = data.toString();

      var ast = jsp.parse(libCode); // parse code and get the initial AST
      ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
      var compiledCode = pro.gen_code(ast); // compressed code here
      fs.writeFile(config.libOut, compiledCode, function () {
        console.log('Done!');
      });
    })

  });
});
