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
  ,'src/keybindings'
  ,'src/constants'
  ,'src/utils'

  // Views
  ,'src/view/checkbox'
  ,'src/view/ease-select'
  ,'src/view/fps-slider'
  ,'src/view/background'
  ,'src/view/css-output'
  ,'src/view/html-input'
  ,'src/view/custom-ease'
  ,'src/view/rekapi-controls'
  ,'src/view/orientation-controls'
  ,'src/view/management-console'

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

  ,Keybindings
  ,constant
  ,util

  ,CheckboxView
  ,EaseSelectView
  ,FPSSliderView
  ,BackgroundView
  ,CSSOutputView
  ,HTMLInputView
  ,CustomEaseView
  ,RekapiControlsView
  ,OrientationControlsView
  ,ManagementConsoleView

  ,AnimationModel

  ,ActorCollection

) {
  'use strict';

  var $win = $(window);
  var $body = $(document.body);

  /**
   * @implements {Backbone.Events}
   * @constructor
   */
  function Stylie () {
    this.config = {
      activeClasses: {
        moz: false
        ,ms: false
        ,o: false
        ,webkit: false
        ,w3: true
      }
    };

    this.view = {};

    this.config.queryString = util.getQueryParams();

    if (navigator.userAgent.match(/iphone/i)) {
      $body.addClass('iphone');
    }

    this.rekapi = new Rekapi(document.getElementById('preview-area'));
    this.$rekapiContext = $(this.rekapi.context);

    if (!this.config.queryString.debug) {
      this.rekapi.play();
    }

    this.actorCollection = new ActorCollection([], { stylie: this });
    this.animationModel = new AnimationModel({}, { stylie: this });

    this.rekapi.addActor({
      context: $('#preview-area').children()[0]
    });

    this.initViews();

    var currentActorModel = this.actorCollection.getCurrent();
    this.listenTo(currentActorModel, 'change', _.bind(function () {
      this.rekapi.update();
    }, this));

    if (window.localStorage.transientAnimation) {
      this.animationModel.setCurrentState(
          JSON.parse(window.localStorage.transientAnimation));
    } else {
      this.createDefaultState();
    }

    this.on(constant.PATH_CHANGED,
        _.bind(this.saveTransientAnimation, this));

    $(window).trigger('resize');

    window.stylie = this;
  }

  _.extend(Stylie.prototype, Backbone.Events);

  Stylie.prototype.createDefaultState = function () {
    var winWidth = $win.width();
    var currentActorModel = this.actorCollection.getCurrent();
    var crosshairStartingY = $win.height() / 2;

    // Create the initial keyframes.
    _.each([0, constant.INITIAL_ANIMATION_DURATION], function (millisecond, i) {
      currentActorModel.keyframe(millisecond, {
        x: i
          ? winWidth - (winWidth / (i + 1))
          : 60 // TODO: Should this be a constant?
        ,y: crosshairStartingY
        ,scale: 1
        ,rX: 0
        ,rY: 0
        ,rZ: 0
      }, 'linear linear linear linear linear');

    });

    this.view.customEase.setUpDefaultEasings();
    this.view.htmlInput.resetToDefault();
  };

  Stylie.prototype.initViews = function () {
    this.keybindings = new Keybindings(this);

    this.view.helpModal = new ModalView({
      el: document.getElementById('help-contents')
      ,$triggerEl: $('#help-trigger')
    });

    this.view.rekapiControls = new RekapiControlsView({
      stylie: this
    });

    this.view.background = new BackgroundView({
      stylie: this
      ,el: $('#tween-path')[0]
      ,$header: $('header')
      ,height: $win.height()
      ,width: $win.width()
    });

    this.view.showPath = new CheckboxView({
      $el: $('#show-path')
      ,callHandlerOnInit: true
      ,onChange: _.bind(function (evt, isChecked) {
        this.trigger(constant.TOGGLE_PATH_AND_CROSSHAIRS, !!isChecked);
      }, this)
    });

    this.view.controlPane = new PaneView({
      el: document.getElementById('control-pane')
    });

    this.view.controlPaneTabs = new TabsView({
      el: document.querySelector('#control-pane')
    });

    this.view.cssOutput = new CSSOutputView({
      stylie: this
      ,el: document.querySelector('#css-output textarea')
      ,$trigger: this.view.controlPaneTabs.$el
          .find('[data-target="css-output"]')
      ,$animationIteration: $('#iterations')
    });

    this.view.fpsSlider = new FPSSliderView({
      stylie: this
      ,el: document.querySelector('.quality-slider.fps .slider')
    });

    var cssNameField = new AutoUpdateTextFieldView({
      el: document.getElementById('css-name')
    });

    cssNameField.onValReenter = _.bind(function (val) {
      this.config.className = val;
      this.trigger(constant.UPDATE_CSS_OUTPUT);
    }, this);

    this.view.cssNameField = cssNameField;

    ['moz', 'ms', 'o', 'webkit', 'w3'].forEach(function (prefix) {
      this.view[prefix + 'Checkbox'] = new CheckboxView({
        $el: $('#' + prefix + '-toggle')
        ,onChange: _.bind(function (evt, isChecked) {
          this.config.activeClasses[prefix] = isChecked;
          this.trigger(constant.UPDATE_CSS_OUTPUT);
        }, this)
      });
    }, this);

    this.view.htmlInput = new HTMLInputView({
      stylie: this
      ,el: $('#html-input textarea')[0]
    });

    this.view.centerToPathCheckbox = new CheckboxView({
      $el: $('#center-to-path')
      ,callHandlerOnInit: true
      ,onChange: _.bind(function (evt, isChecked) {
        var isCenteredToPath = !!isChecked;
        var tranformOrigin = isCenteredToPath ? '0 0' : '';

        this.view.htmlInput.$renderTarget.css(
          'transform-origin', tranformOrigin);
        this.actorCollection.getCurrent().set(
          'isCenteredToPath', isCenteredToPath);
      }, this)
    });

    this.view.customEase = new CustomEaseView({
      stylie: this
      ,el: document.getElementById('custom-ease')
    });

    this.view.topLevelAlert = new AlertView({
      el: document.getElementById('top-level-alert')
    });

    var topLevelAlert = this.view.topLevelAlert;
    this.on(constant.ALERT_ERROR,
        _.bind(topLevelAlert.show, topLevelAlert));

    this.view.managementConsole = new ManagementConsoleView({
      stylie: this
      ,el: document.getElementById('management-console')
      ,model: this.animationModel
    });

    this.view.orientation = new OrientationControlsView({
      stylie: this
      ,el: document.getElementById('orientation-controls')
    });
  };

  Stylie.prototype.clearCurrentState = function () {
    this.actorCollection.getCurrent().removeAllKeyframes();
    this.view.customEase.removeAllEasings();
  };

  Stylie.prototype.saveTransientAnimation = _.throttle(function () {
    window.localStorage.transientAnimation =
      JSON.stringify(this.animationModel.getCurrentState());
  }, constant.TRANSIENT_SAVE_THROTTLE_MS);

  return Stylie;
});
