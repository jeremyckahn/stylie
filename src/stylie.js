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
    this.config = {
      'activeClasses': {
        'moz': false
        ,'ms': false
        ,'o': false
        ,'webkit': false
        ,'w3': true
      }
    };
    this.collection = {};
    this.view = {};

    this.config.queryString = util.getQueryParams();

    if (navigator.userAgent.match(/iphone/i)) {
      $body.addClass('iphone');
    }

    this.rekapi = new Rekapi(document.getElementById('rekapi-canvas'));

    if (!this.config.queryString.debug) {
      this.rekapi.play();
    }

    this.collection.actors = new ActorCollection([], { stylie: this });
    this.animationModel = new AnimationModel({}, { stylie: this });

    this.initActors();
    this.initViews();

    $(window).trigger('resize');

    window.stylie = this;
  }

  Stylie.prototype.initActors = function () {
    this.rekapi.addActor({
      context: $('#rekapi-canvas').children()[0]
    });

    var winWidth = $win.width();
    var currentActorModel = this.collection.actors.getCurrent();
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
    this.view.hotkeyHandler = new HotkeyHandlerView({
      'stylie': this
      ,'el': document.body
    });

    this.view.helpModal = new ModalView({
      'el': document.getElementById('help-contents')
      ,'$triggerEl': $('#help-trigger')
    });

    var $canvasBG = $('#tween-path');

    this.view.rekapiControls = new RekapiControlsView({
      'stylie': this
      ,'$canvasBG': $canvasBG
    });

    this.view.canvas = new CanvasView({
      'stylie': this
      ,'el': document.getElementById('rekapi-canvas')
      ,'$canvasBG': $canvasBG
    });

    this.view.showPath = new CheckboxView({
      '$el': $('#show-path')
      ,'callHandlerOnInit': true
      ,'onChange': _.bind(function (evt, isChecked) {
        this.config.isPathShowing = !!isChecked;
        this.rekapi.update();
        this.view.canvas.backgroundView.update();
      }, this)
    });

    this.view.controlPane = new PaneView({
      'el': document.getElementById('control-pane')
    });

    this.view.controlPaneTabs = new TabsView({
      'el': document.querySelector('#control-pane')
    });

    this.view.cssOutput = new CSSOutputView({
      'stylie': this
      ,'el': document.querySelector('#css-output textarea')
      ,'$trigger': this.view.controlPaneTabs.$el
          .find('[data-target="css-output"]')
      ,'$animationIteration': $('#iterations')
    });

    this.view.fpsSlider = new FPSSliderView({
      '$el': $('.quality-slider.fps .slider')
    });

    var cssNameField = new AutoUpdateTextFieldView({
      'el': document.getElementById('css-name')
    });

    cssNameField.onValReenter = _.bind(function (val) {
      this.config.className = val;
      Backbone.trigger(constant.UPDATE_CSS_OUTPUT);
    }, this);

    this.view.cssNameField = cssNameField;

    ['moz', 'ms', 'o', 'webkit', 'w3'].forEach(function (prefix) {
      this.view[prefix + 'Checkbox'] = new CheckboxView({
        '$el': $('#' + prefix + '-toggle')
        ,'onChange': _.bind(function (evt, isChecked) {
          this.config.activeClasses[prefix] = isChecked;
          Backbone.trigger(constant.UPDATE_CSS_OUTPUT);
        }, this)
      });
    }, this);

    this.view.htmlInput = new HTMLInputView({
      '$el': $('#html-input textarea')
    });

    this.view.centerToPathCheckbox = new CheckboxView({
      '$el': $('#center-to-path')
      ,'callHandlerOnInit': true
      ,'onChange': _.bind(function (evt, isChecked) {
        this.config.isCenteredToPath = !!isChecked;
        var tranformOrigin = this.config.isCenteredToPath
          ? '0 0'
          : '';
        this.view.htmlInput.$renderTarget.css(
          'transform-origin', tranformOrigin);
        Backbone.trigger(constant.ACTOR_ORIGIN_CHANGED, true);
        this.rekapi.update();
      }, this)
    });

    this.view.customEaseView = new CustomEaseView({
      'stylie': this
      ,'el': document.getElementById('custom-ease')
    });

    this.view.topLevelAlertView = new AlertView({
      'el': document.getElementById('top-level-alert')
    });

    var topLevelAlertView = this.view.topLevelAlertView;
    Backbone.on(constant.ALERT_ERROR,
        _.bind(topLevelAlertView.show, topLevelAlertView));

    this.view.saveView = new SaveView({
      'el': document.getElementById('save-controls')
      ,'model': this.animationModel
    });

    this.view.loadView = new LoadView({
      'stylie': this
      ,'el': document.getElementById('load-controls')
      ,'model': this.animationModel
    });

    this.view.orientationView = new OrientationControlsView({
      'el': document.getElementById('orientation-controls')
    });
  };

  return Stylie;
});
