require([
    // Misc
    'src/utils'

    // Views
    ,'src/ui/checkbox', 'src/ui/select', 'src/ui/auto-update-textfield'
    ,'src/ui/ease-field', 'src/ui/crosshairs' ,'src/ui/canvas', 'src/ui/pane'
    ,'src/ui/tabs', 'src/ui/css-output' ,'src/ui/html-input'
    ,'src/ui/keyframe-forms', 'src/ui/incrementer-field', 'src/ui/modal'
    ,'src/ui/hotkey-handler', 'src/ui/rekapi-controls'

    // Collections
    ,'src/collection/keyframes'

    ], function (utils

      ,CheckboxView, SelectView, AutoUpdateTextFieldView
      ,EaseFieldView, CrosshairsView, CanvasView, PaneView
      ,TabsView, CSSOutputView, HTMLInputView
      ,KeyframeFormsView, IncrementerFieldView, ModalView
      ,HotkeyHandlerView, RekapiControlsView

      ,KeyframeCollection) {

  var $win = $(window);
  var app = {
    'config': {
        'activeClasses': {}
      }
    ,'constant': {}
    ,'events': {}
    ,'util': {}
    ,'view': {}
    ,'collection': {}
  };


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
      ,'app': app
    })

    ,'y': new SelectView({
      '$el': $('#y-easing')
      ,'app': app
    })

    ,'r': new SelectView({
      '$el': $('#r-easing')
      ,'app': app
    })
  };

  app.view.hotkeyHandlerView = new HotkeyHandlerView({
    'app': app
    ,'$el': $(document.body)
  });

  app.view.helpModal = new ModalView({
    'app': app
    ,'$el': $('#help-contents')
    ,'$triggerEl': $('#help-trigger')
  });

  app.view.durationFieldView = new IncrementerFieldView({
    'app': app
    ,'$el': $('#duration')
    ,'onValReenter': function (val) {
      if (!isNaN(val)) {
        var validVal = Math.abs(val);
        this.app.util.moveLastKeyframe(this.app.config.currentActor, validVal);
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
      ,'app': app
    });

    app.config.easeFields.push(easeFieldView);
  });


  var halfCrossHairHeight = $('#crosshairs .crosshair:first').height() / 2;
  var crosshairStartingY = ($win.height() / 2) - halfCrossHairHeight;

  app.view.keyframeForms = new KeyframeFormsView({
    'app': app
    ,'$el': $('#keyframe-controls .controls')
  });

  app.view.crosshairs = new CrosshairsView({
    'app': app
    ,'$el': $('#crosshairs')
  });

  app.collection.keyframes = new KeyframeCollection([], { 'app': app });

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
    }, { 'app': app });
  });

  // TODO: This has the wrong name and namespace.
  app.canvasView = new CanvasView({
    'app': app
    ,'$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.view.rekapiControls = new RekapiControlsView({
    'app': app
  });

  app.canvasView.backgroundView.update();

  if (!app.constant.QUERY_STRING.debug) {
    app.kapi.play();
  }

  app.view.showPathView = new CheckboxView({
    'app': app
    ,'$el': $('#show-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      this.app.config.isPathShowing = !!checked;
      this.app.kapi.update();
      this.app.canvasView.backgroundView.update();
    }
  });

  app.view.controlPaneView = new PaneView({
    'app': app
    ,'$el': $('#control-pane')
  });

  app.view.controlPaneTabsView = new TabsView({
    'app': app
    ,'$el': $('#control-pane')
  });

  app.view.cssOutputView = new CSSOutputView({
    'app': app
    ,'$el': $('#css-output textarea')
    ,'$trigger': app.view.controlPaneTabsView.$el
        .find('[data-target="css-output"]')
  });

  subscribe(app.constant.UPDATE_CSS_OUTPUT, function () {
    app.view.cssOutputView.renderCSS();
  });

  app.view.cssNameFieldView = new AutoUpdateTextFieldView({
    'app': app
    ,'$el': $('#css-name')
    ,'onKeyup': function (val) {
      this.app.config.className = val;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.mozCheckboxView = new CheckboxView({
    'app': app
    ,'$el': $('#moz-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.moz = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.msCheckboxView = new CheckboxView({
    'app': app
    ,'$el': $('#ms-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.ms = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.oCheckboxView = new CheckboxView({
    'app': app
    ,'$el': $('#o-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.o = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.webkitCheckboxView = new CheckboxView({
    'app': app
    ,'$el': $('#webkit-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.webkit = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.w3CheckboxView = new CheckboxView({
    'app': app
    ,'$el': $('#w3-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.w3 = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.htmlInputView = new HTMLInputView({
    'app': app
    ,'$el': $('#html-input textarea')
  });

  app.view.centerToPathView = new CheckboxView({
    'app': app
    ,'$el': $('#center-to-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      this.app.config.isCenteredToPath = !!checked;
      var tranformOrigin = this.app.config.isCenteredToPath
        ? '0 0'
        : '';
      app.view.htmlInputView.$renderTarget.css(
        'transform-origin', tranformOrigin);
      publish(this.app.constant.KEYFRAME_UPDATED, [true]);
      this.app.kapi.update();
    }
  });

  $(window).trigger('resize');

  if (app.constant.QUERY_STRING.debug) {
    window.app = app;
  }

});
