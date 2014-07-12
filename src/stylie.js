define([

  // Libraries
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'shifty'
  ,'rekapi'

  // Extensions
  ,'tabs'
  ,'pane'
  ,'alert'
  ,'auto-update-textfield'
  ,'modal'

  // Misc
  ,'src/app'
  ,'src/constants'
  ,'src/utils'

  // Views
  ,'src/view/checkbox'
  ,'src/view/ease-select'
  ,'src/view/fps-slider'
  ,'src/view/canvas'
  ,'src/view/css-output'
  ,'src/view/html-input'
  ,'src/view/custom-ease'
  ,'src/view/hotkey-handler'
  ,'src/view/rekapi-controls'
  ,'src/view/save'
  ,'src/view/load'
  ,'src/view/orientation-controls'

  // Models
  ,'src/model/animation'

  // Collections
  ,'src/collection/actors'

], function (

  $
  ,_
  ,Backbone
  ,Tweenable
  ,Rekapi

  ,TabsView
  ,PaneView
  ,AlertView
  ,AutoUpdateTextFieldView
  ,ModalView

  ,app
  ,constant
  ,util

  ,CheckboxView
  ,EaseSelectView
  ,FPSSliderView
  ,CanvasView
  ,CSSOutputView
  ,HTMLInputView
  ,CustomEaseView
  ,HotkeyHandlerView
  ,RekapiControlsView
  ,SaveView
  ,LoadView
  ,OrientationControlsView

  ,AnimationModel

  ,ActorCollection

) {
  'use strict';

  var $win = $(window);
  var $body = $(document.body);

  /**
   * @constructor
   */
  function Stylie () {
    app.config.queryString = util.getQueryParams();

    if (navigator.userAgent.match(/iphone/i)) {
      $body.addClass('iphone');
    }

    app.rekapi = new Rekapi(document.getElementById('rekapi-canvas'));

    if (!app.config.queryString.debug) {
      app.rekapi.play();
    }

    app.collection.actors = new ActorCollection();

    this.animationModel = new AnimationModel();

    this.initActors();
    this.initGlobalDOMReferences();
    this.initViews();

    $(window).trigger('resize');

    if (app.config.queryString.debug) {
      window.app = app;
    }
  }

  Stylie.prototype.initGlobalDOMReferences = function () {
    app.$el.animationIteration = $('#iterations');
  };

  Stylie.prototype.initActors = function () {
    app.rekapi.addActor({
      context: $('#rekapi-canvas').children()[0]
    });

    var winWidth = $win.width();
    var currentActorModel = app.collection.actors.getCurrent();
    var halfCrossHairHeight = $('#crosshairs .crosshair:first').height() / 2;
    var crosshairStartingY = ($win.height() / 2) - halfCrossHairHeight;

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
      }, 'linear linear linear linear linear');
    });
  };

  Stylie.prototype.initViews = function () {
    app.view.hotkeyHandler = new HotkeyHandlerView({
      '$el': $(document.body)
    });

    app.view.helpModal = new ModalView({
      'el': document.getElementById('help-contents')
      ,'$triggerEl': $('#help-trigger')
    });

    var $canvasBG = $('#tween-path');

    app.view.rekapiControls = new RekapiControlsView({
      '$canvasBG': $canvasBG
    });

    app.view.canvas = new CanvasView({
      '$el': $('#rekapi-canvas')
      ,'$canvasBG': $canvasBG
    });

    app.view.showPath = new CheckboxView({
      '$el': $('#show-path')
      ,'callHandlerOnInit': true
      ,'onChange': function (evt, isChecked) {
        app.config.isPathShowing = !!isChecked;
        app.rekapi.update();
        app.view.canvas.backgroundView.update();
      }
    });

    app.view.controlPane = new PaneView({
      'el': document.getElementById('control-pane')
    });

    app.view.controlPaneTabs = new TabsView({
      'el': document.querySelector('#control-pane')
    });

    app.view.cssOutput = new CSSOutputView({
      '$el': $('#css-output textarea')
      ,'$trigger': app.view.controlPaneTabs.$el
          .find('[data-target="css-output"]')
    });

    app.view.fpsSlider = new FPSSliderView({
      '$el': $('.quality-slider.fps .slider')
    });

    var autoUpdateTextFieldView = new AutoUpdateTextFieldView({
      'el': document.getElementById('css-name')
    });

    autoUpdateTextFieldView.onKeyup = function (val) {
      app.config.className = val;
      Backbone.trigger(constant.UPDATE_CSS_OUTPUT);
    };

    // onKeyup is being overridden, so re-bind the delegated listeners.
    autoUpdateTextFieldView.delegateEvents();

    app.view.cssNameField = autoUpdateTextFieldView;

    ['moz', 'ms', 'o', 'webkit', 'w3'].forEach(function (prefix) {
      app.view[prefix + 'Checkbox'] = new CheckboxView({
        '$el': $('#' + prefix + '-toggle')
        ,'onChange': function (evt, isChecked) {
          app.config.activeClasses[prefix] = isChecked;
          Backbone.trigger(constant.UPDATE_CSS_OUTPUT);
        }
      });
    }, this);

    app.view.htmlInput = new HTMLInputView({
      '$el': $('#html-input textarea')
    });

    app.view.centerToPathCheckbox = new CheckboxView({
      '$el': $('#center-to-path')
      ,'callHandlerOnInit': true
      ,'onChange': function (evt, isChecked) {
        app.config.isCenteredToPath = !!isChecked;
        var tranformOrigin = app.config.isCenteredToPath
          ? '0 0'
          : '';
        app.view.htmlInput.$renderTarget.css(
          'transform-origin', tranformOrigin);
        Backbone.trigger(constant.ACTOR_ORIGIN_CHANGED, true);
        app.rekapi.update();
      }
    });

    app.view.customEaseView = new CustomEaseView({
      '$el': $('#custom-ease')
    });

    app.view.topLevelAlertView = new AlertView({
      'el': document.getElementById('top-level-alert')
    });

    var topLevelAlertView = app.view.topLevelAlertView;
    Backbone.on(constant.ALERT_ERROR,
        _.bind(topLevelAlertView.show, topLevelAlertView));

    app.view.saveView = new SaveView({
      '$el': $('#save-controls')
      ,'model': this.animationModel
    });

    app.view.loadView = new LoadView({
      '$el': $('#load-controls')
      ,'model': this.animationModel
    });

    app.view.orientationView = new OrientationControlsView({
      '$el': $('#orientation-controls')
    });
  };

  return Stylie;
});
