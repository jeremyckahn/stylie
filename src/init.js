require([
    // Misc
    'src/app'
    ,'src/constants'
    ,'src/utils'

    // Views
    ,'src/ui/checkbox', 'src/ui/select', 'src/ui/auto-update-textfield'
    ,'src/ui/ease-field', 'src/ui/crosshairs' ,'src/ui/canvas', 'src/ui/pane'
    ,'src/ui/tabs', 'src/ui/css-output' ,'src/ui/html-input'
    ,'src/ui/keyframe-forms', 'src/ui/incrementer-field', 'src/ui/modal'
    ,'src/ui/hotkey-handler', 'src/ui/rekapi-controls', 'src/ui/alert'

    // Collections
    ,'src/collection/keyframes'

    ], function (
      app
      ,constant
      ,util

      ,CheckboxView, SelectView, AutoUpdateTextFieldView
      ,EaseFieldView, CrosshairsView, CanvasView, PaneView
      ,TabsView, CSSOutputView, HTMLInputView
      ,KeyframeFormsView, IncrementerFieldView, ModalView
      ,HotkeyHandlerView, RekapiControlsView, AlertView

      ,KeyframeCollection) {

  'use strict';

  var $win = $(window);

  app.config.queryString = util.getQueryParams();

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

  app.view.selectX = new SelectView({
    '$el': $('#x-easing')
  });

  app.view.selectY = new SelectView({
    '$el': $('#y-easing')
  });

  app.view.selectR = new SelectView({
    '$el': $('#r-easing')
  });

  app.view.hotkeyHandler = new HotkeyHandlerView({
    '$el': $(document.body)
  });

  app.view.helpModal = new ModalView({
    '$el': $('#help-contents')
    ,'$triggerEl': $('#help-trigger')
  });

  app.view.durationField = new IncrementerFieldView({
    '$el': $('#duration')
    ,'onValReenter': function (val) {
      if (!isNaN(val)) {
        var validVal = Math.abs(val);
        util.moveLastKeyframe(app.config.currentActor, validVal);
      }
    }
  });

  app.config.animationDuration = app.config.initialDuration =
      +app.view.durationField.$el.val();

  app.$el.animationIteration = $('#iterations');

  //app.views.easeFields = [];
  $('.ease').each(function (i, el) {
    app.view['easeField' + i] = new EaseFieldView({
      '$el': $(el)
    });

    //app.views.easeFields.push(easeFieldView);
  });


  var halfCrossHairHeight = $('#crosshairs .crosshair:first').height() / 2;
  var crosshairStartingY = ($win.height() / 2) - halfCrossHairHeight;

  app.view.keyframeForms = new KeyframeFormsView({
    '$el': $('#keyframe-controls .controls')
  });

  app.view.crosshairs = new CrosshairsView({
    '$el': $('#crosshairs')
  });

  app.collection.keyframes = new KeyframeCollection();

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

  app.view.canvas = new CanvasView({
    '$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.view.rekapiControls = new RekapiControlsView();

  app.view.canvas.backgroundView.update();

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
      publish(constant.KEYFRAME_UPDATED, [true]);
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
