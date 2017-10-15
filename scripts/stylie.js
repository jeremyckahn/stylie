define([

  'underscore'
  ,'lateralus'
  ,'keydrown'

  ,'aenima/mixins/lateralus'
  ,'aenima/components/shifty/main'
  ,'./components/rekapi/main'
  ,'./components/keybindings/main'
  ,'./components/container/main'

  ,'./model'

  ,'aenima/data-adapter'

  ,'./constant'

], function (

  _
  ,Lateralus
  ,kd

  ,LateralusMixins
  ,ShiftyComponent
  ,RekapiComponent
  ,KeybindingsComponent
  ,ContainerComponent

  ,StylieModel

  ,DataAdapter

  ,constant

) {
  'use strict';

  /**
   * @param {Element} el
   * @param {Object} [options]
   * @param {boolean} [options.isEmbedded]
   * @param {string} [options.embeddedImgRoot]
   * @extends {Lateralus}
   * @constuctor
   */
  var Stylie = Lateralus.beget(function (el, options) {
    this.options = _.clone(options || {});

    Lateralus.apply(this, arguments);

    this.hasInitialized = false;

    this.dataAdapter = new DataAdapter({
      apiRoot: constant.API_ROOT
    });

    kd.run(kd.tick);

    this.initHacks();

    this.shiftyComponent = this.addComponent(ShiftyComponent);
    this.rekapiComponent = this.addComponent(RekapiComponent);
    this.keybindingsComponent = this.addComponent(KeybindingsComponent);
    this.containerComponent = this.addComponent(ContainerComponent);
    _.defer(this.deferredInitialize.bind(this));
  }, {
    Model: StylieModel
  });

  var fn = Stylie.prototype;

  fn.deferredInitialize = function () {
    if (!this.model.get('isEmbedded')) {
      this.shiftyComponent.addNewCurve();
    }

    var savedAnimations = this.model.get('savedAnimations');
    var transientAnimation = savedAnimations[constant.TRANSIENT_ANIMATION_NAME];

    if (transientAnimation) {
      this.loadAnimation(constant.TRANSIENT_ANIMATION_NAME);
    } else {
      this.createDefaultAnimation();
    }

    this.rekapiComponent.rekapi.play();

    if (this.getQueryParam('pause')) {
      this.rekapiComponent.rekapi.pause();
    }

    // Necessary for keeping the UI in sync after startup.
    this.saveCurrentAnimationAs(constant.TRANSIENT_ANIMATION_NAME);

    this.emit(
      'savedAnimationListUpdated'
      ,this.getSavedAnimationDisplayList()
    );

    this.hasInitialized = true;
  };

  var queryParams = (function () {
    var queryString = location.search.slice(1);
    var stringChunks = queryString.split('&');

    var accumulator = {};
    stringChunks.forEach(function (stringChunk) {
      var pair = stringChunk.split('=');
      accumulator[pair[0]] = pair[1];
    });

    return accumulator;
  })();

  /**
   * @param {string} param
   * @return {*}
   */
  fn.getQueryParam = function (param) {
    return queryParams[param];
  };

  fn.createDefaultAnimation = function () {
    var actorModel = this.rekapiComponent.actorModel;
    actorModel.addNewKeyframe({
      state: this.getInitialKeyframeState()
    });
    actorModel.addNewKeyframe();
  };

  fn.lateralusEvents = _.extend({
    'rekapi:timelineModified': function () {
      if (this.hasInitialized) {
        this.saveCurrentAnimationAs(constant.TRANSIENT_ANIMATION_NAME);
      }
    }

    /**
     * @param {string} animationName
     */
    ,userRequestSaveCurrentAnimation: function (animationName) {
      this.saveCurrentAnimationAs(animationName);
    }

    /**
     * @param {string} animationName
     */
    ,userRequestLoadAnimation: function (animationName) {
      this.loadAnimation(animationName);
    }

    /**
     * @param {string} animationName
     */
    ,userRequestDeleteAnimation: function (animationName) {
      this.deleteAnimation(animationName);
    }

    ,userRequestResetAnimation: function () {
      this.emit('requestRecordUndoState');
      this.rekapiComponent.clearCurrentAnimation();
      this.createDefaultAnimation();
    }

    ,userRequestToggleRotationEditMode: function () {
      this.model.set(
        'isRotationModeEnabled', !this.model.get('isRotationModeEnabled'));
    }
  }, LateralusMixins.lateralusEvents);

  _.extend(fn, LateralusMixins.fn);

  fn.initHacks = function () {
    var hasSafari = navigator.userAgent.match(/safari/i);
    var hasChrome = navigator.userAgent.match(/chrome/i);
    var isFirefox = navigator.userAgent.match(/firefox/i);

    if (hasSafari && !hasChrome) {
      this.$el.addClass('safari');
    } else if (hasChrome) {
      this.$el.addClass('chrome');
    } else if (isFirefox) {
      this.$el.addClass('firefox');
    }
  };

  /**
   * @return {Object}
   */
  fn.getInitialKeyframeState = function () {
    return {
      x: 50
      ,y: this.containerComponent.view.$el.height() / 2
    };
  };

  /**
   * @return {Array.<string>}
   */
  fn.getSavedAnimationDisplayList = function () {
    var rawList = this.model.get('savedAnimations');
    return Object.keys(_.omit(rawList, constant.TRANSIENT_ANIMATION_NAME));
  };

  /**
   * @param {string} animationName
   */
  fn.saveCurrentAnimationAs = function (animationName) {
    var savedAnimations = this.model.get('savedAnimations');

    // A safe copy is needed to sever any deep object references (specifically,
    // the curves sub-object gets modified by this.loadAnimation).
    var animationCopy =
      JSON.parse(JSON.stringify(this.rekapiComponent.toJSON()));
    savedAnimations[animationName] = animationCopy;
    this.model.set('savedAnimations', savedAnimations);

    // Force a change event to persist the saved animations to localStorage.
    this.model.trigger('change');

    if (animationName !== constant.TRANSIENT_ANIMATION_NAME) {
      this.emit(
        'savedAnimationListUpdated'
        ,this.getSavedAnimationDisplayList()
        ,animationName
      );
    }
  };

  /**
   * @param {string} animationName
   */
  fn.loadAnimation = function (animationName) {
    var animationData = this.model.get('savedAnimations')[animationName];
    this.rekapiComponent.fromJSON(animationData);
  };

  /**
   * @param {string} animationName
   */
  fn.deleteAnimation = function (animationName) {
    var savedAnimations = this.model.get('savedAnimations');
    this.model.set('savedAnimations', _.omit(savedAnimations, animationName));

    // Force a change event to persist the animation list to localStorage.
    this.model.trigger('change');

    this.emit('savedAnimationListUpdated', this.getSavedAnimationDisplayList());
  };

  /**
   * @return {Object}
   */
  fn.exportTimelineForMantra = function () {
    return this.rekapiComponent.exportTimelineForMantra();
  };

  return Stylie;
});
