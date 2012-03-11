var requirejs = require('requirejs');
var fs = require('fs');

var config = {
    baseUrl: './',
    name: 'src/init',
    out: 'dist/app.js'
};

requirejs.optimize(config, function (buildResponse) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    var contents = fs.readFileSync(config.out, 'utf8');
});
