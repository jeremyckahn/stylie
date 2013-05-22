require([
    // Misc
    'src/utils'

    // Views
    ,'src/ui/checkbox', 'src/ui/button'
    ,'src/ui/select', 'src/ui/auto-update-textfield', 'src/ui/ease-field'
    ,'src/ui/crosshair','src/ui/crosshairs', 'src/ui/canvas', 'src/ui/pane'
    ,'src/ui/tabs', 'src/ui/css-output', 'src/ui/html-input'
    ,'src/ui/keyframe-forms', 'src/ui/incrementer-field', 'src/ui/modal'
    ,'src/ui/hotkey-handler', 'src/ui/rekapi-controls', 'src/ui/keyframe'

    // Collections
    ,'src/collection/keyframes'

    ], function (utils

      ,checkbox, button
      ,select, autoUpdateTextfield, easeField
      ,crosshair, crosshairs, canvas, pane,
      tabs ,cssOutput, htmlInput,
      keyframeForms ,incrementerField, modal,
      hotkeyHandler ,rekapiControls, keyframe

      ,keyframes) {

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
    'x': new select.view({
      '$el': $('#x-easing')
      ,'app': app
    })

    ,'y': new select.view({
      '$el': $('#y-easing')
      ,'app': app
    })

    ,'r': new select.view({
      '$el': $('#r-easing')
      ,'app': app
    })
  };

  app.view.hotkeyHandler = new hotkeyHandler.view({
    'app': app
    ,'$el': $(document.body)
  });

  app.view.helpModal = new modal.view({
    'app': app
    ,'$el': $('#help-contents')
    ,'$triggerEl': $('#help-trigger')
  });

  app.view.durationFieldView = new incrementerField.view({
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
    var easeFieldInst = new easeField.view({
      '$el': $(el)
      ,'app': app
    });

    app.config.easeFields.push(easeFieldInst);
  });


  var halfCrossHairHeight = $('#crosshairs .crosshair:first').height() / 2;
  var crosshairStartingY = ($win.height() / 2) - halfCrossHairHeight;

  app.view.keyframeForms = new keyframeForms.view({
    'app': app
    ,'$el': $('#keyframe-controls .controls')
  });

  app.view.crosshairs = new crosshairs.view({
    'app': app
    ,'$el': $('#crosshairs')
  });

  app.collection.keyframes = new keyframes.collection([], { 'app': app });

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
  app.canvasView = new canvas.view({
    'app': app
    ,'$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.view.rekapiControls = new rekapiControls.view({
    'app': app
  });

  app.canvasView.backgroundView.update();

  if (!app.constant.QUERY_STRING.debug) {
    app.kapi.play();
  }

  app.view.showPathView = new checkbox.view({
    'app': app
    ,'$el': $('#show-path')
    ,'callHandlerOnInit': true
    ,'onChange': function (evt, checked) {
      this.app.config.isPathShowing = !!checked;
      this.app.kapi.update();
      this.app.canvasView.backgroundView.update();
    }
  });

  app.view.controlPaneView = new pane.view({
    'app': app
    ,'$el': $('#control-pane')
  });

  app.view.controlPaneTabsView = new tabs.view({
    'app': app
    ,'$el': $('#control-pane')
  });

  app.view.cssOutputView = new cssOutput.view({
    'app': app
    ,'$el': $('#css-output textarea')
    ,'$trigger': app.view.controlPaneTabsView.$el
        .find('[data-target="css-output"]')
  });

  subscribe(app.constant.UPDATE_CSS_OUTPUT, function () {
    app.view.cssOutputView.renderCSS();
  });

  app.view.cssNameFieldView = new autoUpdateTextfield.view({
    'app': app
    ,'$el': $('#css-name')
    ,'onKeyup': function (val) {
      this.app.config.className = val;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.mozCheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#moz-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.moz = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.msCheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#ms-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.ms = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.oCheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#o-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.o = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.webkitCheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#webkit-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.webkit = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.w3CheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#w3-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.w3 = checked;
      publish(app.constant.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.htmlInputView = new htmlInput.view({
    'app': app
    ,'$el': $('#html-input textarea')
  });

  app.view.centerToPathView = new checkbox.view({
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
