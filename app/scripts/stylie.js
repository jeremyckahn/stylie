define([

  'underscore'
  ,'lateralus'

  ,'stylie.component.shifty'
  ,'stylie.component.rekapi'
  ,'stylie.component.container'

  ,'./model'
  ,'./mixins/local-storage-model'

  ,'./constant'

], function (

  _
  ,Lateralus

  ,ShiftyComponent
  ,RekapiComponent
  ,ContainerComponent

  ,StylieModel
  ,localStorageMixin

  ,constant

) {
  'use strict';

  /**
   * @param {Element} el
   * @extends {Lateralus}
   * @constuctor
   */
  var Stylie = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);
    this.hasInitialized = false;

    this.initHacks();

    this.shiftyComponent = this.addComponent(ShiftyComponent);
    this.rekapiComponent = this.addComponent(RekapiComponent);
    this.containerComponent = this.addComponent(ContainerComponent);

    this.shiftyComponent.addNewCurve();
    _.defer(this.deferredInitialize.bind(this));
  }, {
    Model: StylieModel
  });

  var fn = Stylie.prototype;

  fn.deferredInitialize = function () {
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

  fn.lateralusEvents = {
    timelineModified: function () {
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
      this.rekapiComponent.clearCurrentAnimation();
      this.createDefaultAnimation();
    }
  };

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
    savedAnimations[animationName] = this.rekapiComponent.toJSON();
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
    this.rekapiComponent.fromJSON(animationName);
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

  return Stylie;
});
