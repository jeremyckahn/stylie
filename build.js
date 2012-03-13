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

// Compress app code
requirejs.optimize(config, function (buildResponse) {
  //buildResponse is just a text output of the modules
  //included. Load the built file for the contents.
  //Use config.out to get the optimized file contents.
  var contents = fs.readFileSync(config.out, 'utf8');
  console.log('Built the app code.');
});

fs.readFile('dev.html', function(err,data){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }

  var html = data.toString();

  // Compress lib code
  var libs = html.match(/lib\/.*.js/g);
  var command = 'cat ' + libs.join(' ') + ' > ' + config.libOut;
  exec(command, function (error, stdout, stderr) {
    fs.readFile(config.libOut, function (err, data) {
      var libCode = data.toString();

      var ast = jsp.parse(libCode); // parse code and get the initial AST
      ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
      var compiledCode = pro.gen_code(ast); // compressed code here
      fs.writeFile(config.libOut, compiledCode, function () {
        console.log('Built the lib code.');
      });
    })
  }); // /lib code


  var optimizedHtml = html
    .replace(/\n/g, '')
    .replace(/>\s*</g, '><')
    .replace(/<!-- scripts -->.*<!-- \/scripts -->/,
      ['<script src="' + config.libOut + '"></script>',
      '<script src="' + 'dist/app.js' + '"></script>'].join(''));

  fs.writeFile('index.html', optimizedHtml, function () {
    console.log('Generated index.html.');

  });
});
