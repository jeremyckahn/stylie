require.config({
  baseUrl: './'
  ,shim: {
    underscore: {
      exports: '_'
    }
    ,backbone: {
      deps: [
        'underscore'
        ,'jquery'
      ]
      ,exports: 'Backbone'
    }
    ,'jquery-mousewheel': {
      deps: [
        'jquery'
      ]
    }
    ,'jquery-dragon': {
      deps: [
        'jquery'
      ]
    }
    ,'jquery-dragon-slider': {
      deps: [
        'jquery'
        ,'jquery-dragon'
      ]
    }
    ,'jquery-cubelet': {
      deps: [
        'jquery'
      ]
    }
  },
  paths: {
    jquery: 'bower_components/jquery/jquery'
    ,'jquery-mousewheel': 'bower_components/jquery-mousewheel/jquery.mousewheel'
    ,'jquery-dragon': 'bower_components/jquery-dragon/src/jquery.dragon'
    ,'jquery-dragon-slider':
        'bower_components/jquery-dragon/src/jquery.dragon-slider'
    ,'jquery-cubelet': 'bower_components/jquery-cubelet/dist/jquery.cubelet'
    ,backbone: 'bower_components/backbone/backbone'
    ,underscore: 'bower_components/underscore/underscore'
    ,'underscore.jck':
        'bower_components/jck-library-extensions/src/underscore/underscore.jck'
    ,shifty: 'bower_components/shifty/dist/shifty'
    ,rekapi: 'bower_components/rekapi/dist/rekapi'
    ,'rekapi-scrubber': 'bower_components/rekapi-controls/src/rekapi-scrubber'
    ,mustache: 'bower_components/mustache/mustache'
    ,bezierizer: 'bower_components/bezierizer/dist/bezierizer'

    // jck-extensions
    /* jshint maxlen: 120 */
    ,'auto-update-textfield':
        'bower_components/jck-library-extensions/src/backbone/auto-update-textfield/auto-update-textfield'
    ,'incrementer-field':
        'bower_components/jck-library-extensions/src/backbone/incrementer-field/incrementer-field'
    ,tabs: 'bower_components/jck-library-extensions/src/backbone/tabs/tabs'
    ,pane: 'bower_components/jck-library-extensions/src/backbone/pane/pane'
    ,alert: 'bower_components/jck-library-extensions/src/backbone/alert/alert'
    ,modal: 'bower_components/jck-library-extensions/src/backbone/modal/modal'
  }
});

require([

  'src/stylie'

  // jQuery plugins that get loaded but not actually used as AMD modules.
  // These don't have a matching callback parameter.
  ,'jquery-mousewheel'
  ,'jquery-dragon'
  ,'jquery-dragon-slider'
  ,'jquery-cubelet'

  // Doesn't return anything
  ,'underscore.jck'

], function (

  Stylie

) {
  'use strict';

  new Stylie();
});
