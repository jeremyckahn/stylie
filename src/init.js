require([
    // Misc
    'src/app'
    ,'src/utils'

    // Views
    ,'src/ui/checkbox', 'src/ui/select', 'src/ui/auto-update-textfield'
    ,'src/ui/ease-field', 'src/ui/crosshairs' ,'src/ui/canvas', 'src/ui/pane'
    ,'src/ui/tabs', 'src/ui/css-output' ,'src/ui/html-input'
    ,'src/ui/keyframe-forms', 'src/ui/incrementer-field', 'src/ui/modal'
    ,'src/ui/hotkey-handler', 'src/ui/rekapi-controls'

    // Collections
    ,'src/collection/keyframes'

    ], function (
      app
      ,utils

      ,CheckboxView, SelectView, AutoUpdateTextFieldView
      ,EaseFieldView, CrosshairsView, CanvasView, PaneView
      ,TabsView, CSSOutputView, HTMLInputView
      ,KeyframeFormsView, IncrementerFieldView, ModalView
      ,HotkeyHandlerView, RekapiControlsView

      ,KeyframeCollection) {

  var $win = $(window);

  // CONSTANTS
  _.extend(app.constant, {
    'PRERENDER_GRANULARITY': 150
    ,'RENDER_GRANULARITY': 100
    ,'KEYFRAME_UPDATED': 'keyframeUpdated'
    ,'UPDATE_CSS_OUTPUT': 'updateCSSOutput'
    ,'TOGGLE_FADE_SPEED': 200
    ,'INITIAL_KEYFRAMES': 2
  });


  // CONFIG
  app.config.activeClasses.moz = false;
  app.config.activeClasses.ms = false;
  app.config.activeClasses.o = false;
  app.config.activeClasses.webkit = false;
  app.config.activeClasses.w3 = true;
  utils.init(app);
  app.constant.QUERY_STRING = app.util.getQueryParams();


  // Doing horrifying hacks here to prevent the variable names from getting
  // mangled by the compiler.
  var customEase1FnString = ['Tweenable.prototype.formula.customEase1 = ',
      'function (x) {return Math.pow(x, 4);}'].join('');
  eval(customEase1FnString);

  var customEase2FnString = ['Tweenable.prototype.formula.customEase2 = ',
    'function (x) {return Math.pow(x, 0.25);}'].join('');
  eval(customEase2FnString);

  app.kapi = new Kapi({
    'context': document.getElementById('rekapi-canvas')
    ,'height': $win.height()
    ,'width': $win.width()
  });

  app.config.selects = {
    'x': new SelectView({
      '$el': $('#x-easing')
    })

    ,'y': new SelectView({
      '$el': $('#y-easing')
    })

    ,'r': new SelectView({
      '$el': $('#r-easing')
    })
  };

  app.view.hotkeyHandlerView = new HotkeyHandlerView({
    '$el': $(document.body)
  });

  app.view.helpModal = new ModalView({
    '$el': $('#help-contents')
    ,'$triggerEl': $('#help-trigger')
  });

  app.view.durationFieldView = new IncrementerFieldView({
    '$el': $('#duration')
    ,'onValReenter': function (val) {
      if (!isNaN(val)) {
        var validVal = Math.abs(val);
        app.util.moveLastKeyframe(app.config.currentActor, validVal);
      }
    }
  });

  app.config.animationDuration = app.config.initialDuration =
      +app.view.durationFieldView.$el.val();

  app.config.animationIteration = $('#iterations');

  app.config.easeFields = [];
  $('.ease').each(function (i, el) {
    var easeFieldView = new EaseFieldView({
      '$el': $(el)
    });

    app.config.easeFields.push(easeFieldView);
  });


  var halfCrossHairHeight = $('#crosshairs .crosshair:first').height() / 2;
  var crosshairStartingY = ($win.height() / 2) - halfCrossHairHeight;

  app.view.keyframeForms = new KeyframeFormsView({
    '$el': $('#keyframe-controls .controls')
  });

  app.view.crosshairs = new CrosshairsView({
    '$el': $('#crosshairs')
  });

  app.collection.keyframes = new KeyframeCollection([]);

  var winWidth = $win.width();

  // Create the initial keyframes.
  _.each([0, 100], function (percent, i) {
    app.collection.keyframes.add({
      'x': i
        ? winWidth - (winWidth / (i + 1))
        : 40 // TODO: Should this be a constant?
      ,'y': crosshairStartingY
      ,'r': 0
      ,'percent': percent
    });
  });

  // TODO: This has the wrong name and namespace.
  app.canvasView = new CanvasView({
    '$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.view.rekapiControls = new RekapiControlsView();

  app.canvasView.backgroundView.update();

  if (!app.constant.QUERY_STRING.debug) {
    app.kapi.play();
  }

  app.view.showPathView = new CheckboxView({
    '$el': $('#show-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      app.config.isPathShowing = !!checked;
      app.kapi.update();
      app.canvasView.backgroundView.update();
    }
  });

  app.view.controlPaneView = new PaneView({
    '$el': $('#control-pane')
  });

  app.view.controlPaneTabsView = new TabsView({
    '$el': $('#control-pane')
  });

  app.view.cssOutputView = new CSSOutputView({
    '$el': $('#css-output textarea')
    ,'$trigger': app.view.controlPaneTabsView.$el
        .find('[data-target="css-output"]')
  });

  subscribe(app.constant.UPDATE_CSS_OUTPUT, function () {
    app.view.cssOutputView.renderCSS();
  });

  app.view.cssNameFieldView = new AutoUpdateTextFieldView({
    '$el': $('#css-name')
    ,'onKeyup': function (val) {
      app.config.className = val;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.mozCheckboxView = new CheckboxView({
    '$el': $('#moz-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.moz = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.msCheckboxView = new CheckboxView({
    '$el': $('#ms-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.ms = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.oCheckboxView = new CheckboxView({
    '$el': $('#o-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.o = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.webkitCheckboxView = new CheckboxView({
    '$el': $('#webkit-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.webkit = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.w3CheckboxView = new CheckboxView({
    '$el': $('#w3-toggle')
    ,'onChange': function (evt, checked) {
      app.config.activeClasses.w3 = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.htmlInputView = new HTMLInputView({
    '$el': $('#html-input textarea')
  });

  app.view.centerToPathView = new CheckboxView({
    '$el': $('#center-to-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      app.config.isCenteredToPath = !!checked;
      var tranformOrigin = app.config.isCenteredToPath
        ? '0 0'
        : '';
      app.view.htmlInputView.$renderTarget.css(
        'transform-origin', tranformOrigin);
      publish(app.constant.KEYFRAME_UPDATED, [true]);
      app.kapi.update();
    }
  });

  $(window).trigger('resize');

  if (app.constant.QUERY_STRING.debug) {
    window.app = app;
  }

});
