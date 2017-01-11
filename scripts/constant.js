define(function () {
  'use strict';

  var isLocalhost = window.location.hostname === 'localhost';

  return {
    CONTROL_PANEL_PADDING_FROM_CORNER: 30
    ,PATH_COLOR: 'rgb(255,176,0)'
    ,PATH_THICKNESS: 4
    ,PATH_RENDER_GRANULARITY: 75
    ,TRANSIENT_ANIMATION_NAME: '__transientAnimation'
    ,mantraRoot: isLocalhost ?
      'http://localhost:9009/' : 'http://jeremyckahn.github.io/mantra/'
    ,API_ROOT: 'http://localhost:8666/api'
  };
});
