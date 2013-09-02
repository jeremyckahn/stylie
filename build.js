var requirejs = require('requirejs');
var fs = require('fs');
var exec = require('child_process').exec;
var UglifyJS = require("uglify-js");

var config = {
  baseUrl: './',
  name: 'src/init',
  out: 'bin/app.js',
  libOut: 'bin/libs.js'
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
  var libs = html.match(/bower_components\/.*.js/g);
  var command = 'cat ' + libs.join(' ') + ' > ' + config.libOut;
  exec(command, function (error, stdout, stderr) {
    fs.readFile(config.libOut, function (err, data) {
      var libCode = data.toString();

      var ast = UglifyJS.parse(libCode); // parse code and get the initial AST
      ast.figure_out_scope();
      var compressor = UglifyJS.Compressor({
        global_defs: {
          SHIFTY_DEBUG: false,
          SHIFTY_DEBUG_NOW: false,
          KAPI_DEBUG: false
        }
      });
      var compressed_ast = ast.transform(compressor);
      compressed_ast.figure_out_scope();
      compressed_ast.compute_char_frequency();
      compressed_ast.mangle_names();
      var compiledCode = compressed_ast.print_to_string();
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
      '<script src="' + 'bin/app.js' + '"></script>'].join(''));

  fs.writeFile('index.html', optimizedHtml, function () {
    console.log('Generated index.html.');

  });
});
