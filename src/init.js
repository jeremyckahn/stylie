require([
    // Misc
    'src/app'
    ,'src/constants'
    ,'src/utils'

    // Views
    ,'src/ui/checkbox', 'src/ui/ease-select', 'src/ui/ease-field'
    ,'src/ui/auto-update-textfield', 'src/ui/canvas', 'src/ui/pane'
    ,'src/ui/tabs', 'src/ui/css-output', 'src/ui/html-input'
    ,'src/ui/incrementer-field', 'src/ui/modal', 'src/ui/hotkey-handler'
    ,'src/ui/rekapi-controls', 'src/ui/alert', 'src/ui/fps-slider'

    // Collections
    ,'src/collection/actors'

    ], function (
      app
      ,constant
      ,util

      ,CheckboxView, EaseSelectView, EaseFieldView
      ,AutoUpdateTextFieldView, CanvasView, PaneView
      ,TabsView, CSSOutputView, HTMLInputView
      ,IncrementerFieldView, ModalView, HotkeyHandlerView
      ,RekapiControlsView, AlertView, FPSSliderView

      ,ActorCollection

      ) {

  'use strict';

  var $win = $(window);

  app.config.queryString = util.getQueryParams();

  // The styling of the <select>s only works in WebKit under OS X.  Do some
  // user agent sniffing and add some top-level classes.
  //
  // TODO: Find a better way to do this that doesn't involve user agent
  // sniffing...
  if (navigator.userAgent.match(/Macintosh/)) {
    $(document.body).addClass('mac');
  }

  if (navigator.userAgent.match(/WebKit/)) {
    $(document.body).addClass('webkit');
  }

  $('.ease').each(function (i, el) {
    app.view['easeField' + i] = new EaseFieldView({
      '$el': $(el)
    });
  });

  app.view.hotkeyHandler = new HotkeyHandlerView({
    '$el': $(document.body)
  });

  app.view.helpModal = new ModalView({
    '$el': $('#help-contents')
    ,'$triggerEl': $('#help-trigger')
  });

  app.$el.animationIteration = $('#iterations');

  var halfCrossHairHeight = $('#crosshairs .crosshair:first').height() / 2;
  var crosshairStartingY = ($win.height() / 2) - halfCrossHairHeight;

  app.kapi = new Kapi({
    'context': document.getElementById('rekapi-canvas')
    ,'height': $win.height()
    ,'width': $win.width()
  });

  app.collection.actors = new ActorCollection();
  app.kapi.on('addActor',
      _.bind(app.collection.actors.syncFromAppKapi, app.collection.actors));

  var domActor = new Kapi.DOMActor($('#rekapi-canvas').children()[0]);
  app.kapi.addActor(domActor);

  var winWidth = $win.width();
  var currentActorModel = app.collection.actors.getCurrent();

  // Create the initial keyframes.
  _.each([0, constant.INITIAL_ANIMATION_DURATION], function (millisecond, i) {
    currentActorModel.keyframe(millisecond, {
      'x': i
        ? winWidth - (winWidth / (i + 1))
        : 60 // TODO: Should this be a constant?
      ,'y': crosshairStartingY
      ,'rX': 0
      ,'rY': 0
      ,'rZ': 0
    }, 'linear');
  });

  app.view.canvas = new CanvasView({
    '$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.view.rekapiControls = new RekapiControlsView();

  if (!app.config.queryString.debug) {
    app.kapi.play();
  }

  app.view.showPath = new CheckboxView({
    '$el': $('#show-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      app.config.isPathShowing = !!checked;
      app.kapi.update();
      app.view.canvas.backgroundView.update();
    }
  });

  app.view.controlPane = new PaneView({
    '$el': $('#control-pane')
  });

  app.view.controlPaneTabs = new TabsView({
    '$el': $('#control-pane')
  });

  app.view.cssOutput = new CSSOutputView({
    '$el': $('#css-output textarea')
    ,'$trigger': app.view.controlPaneTabs.$el
        .find('[data-target="css-output"]')
  });

  app.view.fpsSlider = new FPSSliderView({
    '$el': $('.quality-slider.fps .slider')
  });

  subscribe(constant.UPDATE_CSS_OUTPUT, function () {
    app.view.cssOutput.renderCSS();
  });

  app.view.cssNameField = new AutoUpdateTextFieldView({
    '$el': $('#css-name')
    ,'onKeyup': function (val) {
      app.config.className = val;
      publish(constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.mozCheckbox = new CheckboxView({
    '$el': $('#moz-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.moz = checked;
      publish(constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.msCheckbox = new CheckboxView({
    '$el': $('#ms-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.ms = checked;
      publish(constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.oCheckbox = new CheckboxView({
    '$el': $('#o-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.o = checked;
      publish(constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.webkitCheckbox = new CheckboxView({
    '$el': $('#webkit-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.webkit = checked;
      publish(constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.w3Checkbox = new CheckboxView({
    '$el': $('#w3-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.w3 = checked;
      publish(constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.htmlInput = new HTMLInputView({
    '$el': $('#html-input textarea')
  });

  app.view.centerToPathCheckbox = new CheckboxView({
    '$el': $('#center-to-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      app.config.isCenteredToPath = !!checked;
      var tranformOrigin = app.config.isCenteredToPath
        ? '0 0'
        : '';
      app.view.htmlInput.$renderTarget.css(
        'transform-origin', tranformOrigin);
      publish(constant.ACTOR_ORIGIN_CHANGED, [true]);
      app.kapi.update();
    }
  });

  app.view.topLevelAlert = new AlertView({
    '$el': $('#top-level-alert')
  });

  $(window).trigger('resize');

  if (app.config.queryString.debug) {
    window.app = app;
  }

});
