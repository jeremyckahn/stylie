require([
    // Misc
    'src/utils', 'src/css-gen'

    // Views
    ,'src/ui/checkbox', 'src/ui/button'
    ,'src/ui/select', 'src/ui/auto-update-textfield', 'src/ui/ease-field'
    ,'src/ui/crosshair', 'src/ui/canvas', 'src/ui/pane', 'src/ui/tabs'
    ,'src/ui/css-output', 'src/ui/html-input', 'src/ui/keyframes'

    // Models
    ,'src/model/keyframe'

    ], function (utils, cssGen

      ,checkbox, button
      ,select, autoUpdateTextfield, easeField
      ,crosshair, canvas, pane, tabs
      ,cssOutput, htmlInput, keyframes

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

  app.const.PRERENDER_GRANULARITY = 150;
  app.const.RENDER_GRANULARITY = 100;
  app.config.activeClasses.moz = true;
  app.config.activeClasses.webkit = true;
  app.config.activeClasses.w3 = true;
  app.events.KEYFRAME_UPDATED = 'keyframeUpdated';
  utils.init(app);

  Tweenable.prototype.formula.customEase1 = function (x) {
    return Math.pow(x, 4);
  };

  Tweenable.prototype.formula.customEase2 = function (x) {
    return Math.pow(x, 0.25);
  };

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

  app.view.durationFieldView = new autoUpdateTextfield.view({

    'app': app

    ,'$el': $('#duration')

    ,'ARROW_KEY_INCREMENT': 10

    ,'onValReenter': function (val) {
      if (!isNaN(val)) {
        var validVal = Math.abs(val);
        this.app.util.moveLastKeyframe(this.app.config.currentActor, validVal);
      }
    }

    ,'tweakVal': function (tweakAmount) {
      this.$el.val(parseInt(app.config.animationDuration, 10) + tweakAmount);
      this.$el.trigger('keyup');
    }

    ,'onArrowUp': function () {
      this.tweakVal(this.ARROW_KEY_INCREMENT);
    }

    ,'onArrowDown': function () {
      this.tweakVal(-this.ARROW_KEY_INCREMENT);
    }

  });

  app.config.animationDuration = app.config.initialDuration =
      app.view.durationFieldView.$el.val();

  app.config.easeFields = [];
  $('.ease').each(function (i, el) {
    var easeFieldInst = new easeField.view({
      '$el': $(el)
      ,'app': app
    });

    app.config.easeFields.push(easeFieldInst);
  });

  var crosshairFrom = $('.crosshair.from');
  crosshairFrom.css({
    'left': 20
    ,'top': ($win.height() / 2) - (crosshairFrom.height() / 2)
  });
  var crosshairTo = $('.crosshair.to');
  crosshairTo.css({
    'left': $win.width() / 2
    ,'top': ($win.height() / 2) - (crosshairTo.height() / 2)
  });

  app.config.crosshairs = {
    'from': new crosshair.view({
        'app': app
        ,'$el': crosshairFrom
      })
    ,'to': new crosshair.view({
        'app': app
        ,'$el': crosshairTo
      })
  };

  app.view.keyframes = new keyframes.view({
    'app': app

    ,'$el': $('#keyframe-controls .controls')

    ,'models': [app.config.crosshairs.from.model,
        app.config.crosshairs.to.model]
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
      this.app.kapi.redraw();
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

  app.view.cssNameFieldView = new autoUpdateTextfield.view({

    'app': app

    ,'$el': $('#css-name')

    ,'onKeyup': function (val) {
      this.app.config.className = val;
      this.app.view.cssOutputView.renderCSS();
    }

  });

  app.view.mozCheckboxView = new checkbox.view({

    'app': app

    ,'$el': $('#moz-toggle')

    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.moz = checked;
      this.app.view.cssOutputView.renderCSS();
    }

  });

  app.view.webkitCheckboxView = new checkbox.view({

    'app': app

    ,'$el': $('#webkit-toggle')

    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.webkit = checked;
      this.app.view.cssOutputView.renderCSS();
    }

  });

  app.view.w3CheckboxView = new checkbox.view({

    'app': app

    ,'$el': $('#w3-toggle')

    ,'onChange': function (evt, checked) {
      this.app.config.activeClasses.w3 = checked;
      this.app.view.cssOutputView.renderCSS();
    }

  });

  app.view.htmlInputView = new htmlInput.view({
    'app': app
    ,'$el': $('#html-input textarea')
  });

  subscribe('mainPanel-resize',
      _.bind(app.view.controlPaneView.onResize, app.view.controlPaneView));

  $(window).trigger('resize');

});
