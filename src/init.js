require([
    // Misc
    'src/utils'

    // Views
    ,'src/ui/checkbox', 'src/ui/button'
    ,'src/ui/select', 'src/ui/auto-update-textfield', 'src/ui/ease-field'
    ,'src/ui/crosshair', 'src/ui/canvas', 'src/ui/pane', 'src/ui/tabs'
    ,'src/ui/css-output', 'src/ui/html-input', 'src/ui/keyframes'
    ,'src/ui/incrementer-field'

    // Models
    ,'src/model/keyframe'

    ], function (utils

      ,checkbox, button
      ,select, autoUpdateTextfield, easeField
      ,crosshair, canvas, pane, tabs
      ,cssOutput, htmlInput, keyframes
      ,incrementerField

      ,keyframe) {

  var $win = $(window);
  var app = {
    'config': {
        'activeClasses': {}
      }
    ,'const': {}
    ,'events': {}
    ,'util': {}
    ,'view': {}
    ,'collection': {}
  };


  // CONSTANTS
  app.const.PRERENDER_GRANULARITY = 150;
  app.const.RENDER_GRANULARITY = 100;
  app.const.KEYFRAME_UPDATED = 'keyframeUpdated';
  app.const.UPDATE_CSS_OUTPUT = 'updateCSSOutput';


  // CONFIG
  app.config.activeClasses.moz = true;
  app.config.activeClasses.webkit = true;
  app.config.activeClasses.w3 = true;
  utils.init(app);


  // Doing horrifying hacks here to prevent the variable names from getting
  // mangled by the compiler.
  var customEase1FnString = ['Tweenable.prototype.formula.customEase1 = ',
      'function (x) {return Math.pow(x, 4);}'].join('');
  eval(customEase1FnString);

  var customEase2FnString = ['Tweenable.prototype.formula.customEase2 = ',
    'function (x) {return Math.pow(x, 0.25);}'].join('');
  eval(customEase2FnString);

  app.config.selects = {
    'x': new select.view({
      '$el': $('#x-easing')
      ,'app': app
    })

    ,'y': new select.view({
      '$el': $('#y-easing')
      ,'app': app
    })
  };

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

  app.config.easeFields = [];
  $('.ease').each(function (i, el) {
    var easeFieldInst = new easeField.view({
      '$el': $(el)
      ,'app': app
    });

    app.config.easeFields.push(easeFieldInst);
  });

  app.collection.keyframes = new keyframes.collection();

  $('.crosshair').each(function (i, el) {
    var $el = $(el);
    app.collection.keyframes.add({
      'x': i ? $win.width() - ($win.width() / (i + 1)) : 40
      ,'y': ($win.height() / 2) - ($el.height() / 2)
    }, { 'app': app });
    var keyframeAttrs = app.collection.keyframes.last().getAttrs();
    $el.css({
      'left': keyframeAttrs.x
      ,'top': keyframeAttrs.y
    });
    new crosshair.view({
        'app': app
        ,'$el': $el
        ,'model': app.collection.keyframes.last()
      });
  });

  app.view.keyframes = new keyframes.view({
    'app': app
    ,'$el': $('#keyframe-controls .controls')
    ,'collection': app.collection.keyframes
  });

  app.canvasView = new canvas.view({
    'app': app
    ,'$el': $('#rekapi-canvas')
    ,'$canvasBG': $('#tween-path')
  });

  app.canvasView.backgroundView.update();
  app.kapi.play();

  app.view.showPathView = new checkbox.view({
    'app': app
    ,'$el': $('#show-path')
    ,'preventInitialHandlerCall': true
    ,'onChange': function (evt, checked) {
      this.app.config.isPathShowing = !!checked;
      this.app.util.redrawKapi(this.app.kapi);
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

  subscribe(app.const.UPDATE_CSS_OUTPUT, function () {
    app.view.cssOutputView.renderCSS();
  });

  app.view.cssNameFieldView = new autoUpdateTextfield.view({
    'app': app
    ,'$el': $('#css-name')
    ,'onKeyup': function (val) {
      this.app.config.className = val;
      publish(app.const.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.mozCheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#moz-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.moz = checked;
      publish(app.const.UPDATE_CSS_OUTPUT);
    }
  });

  app.view.webkitCheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#webkit-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.webkit = checked;
      publish(app.const.UPDATE_CSS_OUTPUT);
    }

  });

  app.view.w3CheckboxView = new checkbox.view({
    'app': app
    ,'$el': $('#w3-toggle')
    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.w3 = checked;
      publish(app.const.UPDATE_CSS_OUTPUT);
    }

  });

  app.view.htmlInputView = new htmlInput.view({
    'app': app
    ,'$el': $('#html-input textarea')
  });

  $(window).trigger('resize');

});
