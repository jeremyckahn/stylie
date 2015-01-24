define([

  'underscore'
  ,'lateralus'

  ,'stylie.component.shifty'
  ,'stylie.component.rekapi'
  ,'stylie.component.container'

  ,'./mixins/local-storage-model'

  ,'./constant'

], function (

  _
  ,Lateralus

  ,ShiftyComponent
  ,RekapiComponent
  ,ContainerComponent

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

    var model = this.model;
    model.localStorageId = 'stylieData';
    model.mixin(localStorageMixin);

    if (!model.keys().length) {
      this.setInitialState();
    }

    this.shiftyComponent = this.addComponent(ShiftyComponent);
    this.rekapiComponent = this.addComponent(RekapiComponent);
    this.containerComponent = this.addComponent(ContainerComponent);

    this.shiftyComponent.addNewCurve();
    _.defer(this.deferredInitialize.bind(this));
  });

  var fn = Stylie.prototype;

  fn.deferredInitialize = function () {
    var actorModel = this.rekapiComponent.actorModel;
    var savedAnimations = this.model.get('savedAnimations');
    var transientAnimation = savedAnimations[constant.TRANSIENT_ANIMATION_NAME];

    if (transientAnimation) {
      this.loadAnimation(constant.TRANSIENT_ANIMATION_NAME);
    } else {
      actorModel.addNewKeyframe({
        state: this.getInitialKeyframeState()
      });
      actorModel.addNewKeyframe();
    }

    this.rekapiComponent.rekapi.play();

    // Necessary for keeping the UI in sync after startup.
    this.saveCurrentAnimationAs(constant.TRANSIENT_ANIMATION_NAME);

    this.emit(
      'savedAnimationListUpdated'
      ,this.getSavedAnimationDisplayList()
    );

    this.hasInitialized = true;
  };

  fn.setInitialState = function () {
    this.model.set({
      cssOrientation: 'first-keyframe'
      ,focusedControlPanelTab: ''
      ,savedAnimations: {}
    });
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
   * @return {{
   *   name: string,
   *   fps: number,
   *   vendors: Array.<string>,
   *   isCentered: boolean,
   *   iterations: boolean|undefined
   * }}
   */
  fn.getCssConfigObject = function () {
    return this.containerComponent.controlPanelComponent.getCssConfigObject();
  };

  /**
   * @return {ActorModel}
   */
  fn.getCurrentActorModel = function () {
    return this.rekapiComponent.actorModel;
  };

  /**
   * @return {string}
   */
  fn.getCurrentActorHtml = function () {
    // TODO: Find a less byzantine way to do this.
    return this.containerComponent
      .previewComponent
        .actorContainerComponent
          .getActorHtml();
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
    this.rekapiComponent.loadAnimation(animationName);
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
