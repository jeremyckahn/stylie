/* global console:true, process:true */
var requirejs = require('requirejs');
var fs = require('fs');
var exec = require('child_process').exec;

requirejs.optimize({
  name: 'bower_components/requirejs/require',
  out: 'bin/app.js',
  preserveLicenseComments: false
}, function (buildResponse) {
  console.log('Minified Require.js.');

  // Compress app code
  requirejs.optimize({
    name: 'src/init',
    out: 'bin/_app.js',
    baseUrl: './',
    preserveLicenseComments: false,
    mainConfigFile: 'src/init.js'
  }, function (buildResponse) {
    console.log('Built the app code.');
    exec('cat bin/_app.js >> bin/app.js && rm bin/_app.js',
        function (error, stdout, stderr) {
      if (error) {
        console.log('Error: ' + stderr);
      } else {
        console.log('No errors, all done!');
      }
    });
  });
});

fs.readFile('dev.html', function(err,data){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }

  var html = data.toString();
  var optimizedHtml = html
    .replace(/\n/g, '')
    .replace(/>\s*</g, '><')
    .replace(/<!-- scripts -->.*<!-- \/scripts -->/,
      '<script src="bin/app.js"></script>');

  fs.writeFile('index.html', optimizedHtml, function () {
    console.log('Generated index.html.');

  });
});
