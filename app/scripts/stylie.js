define([

  'underscore'
  ,'lateralus'

  ,'stylie.component.shifty'
  ,'stylie.component.rekapi'
  ,'stylie.component.container'

  ,'./mixins/local-storage-model'

], function (

  _
  ,Lateralus

  ,ShiftyComponent
  ,RekapiComponent
  ,ContainerComponent

  ,localStorageMixin

) {
  'use strict';

  /**
   * @param {Element} el
   * @extends {Lateralus}
   * @constuctor
   */
  var Stylie = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);

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
    actorModel.addNewKeyframe({
      state: this.getInitialKeyframeState()
    });
    actorModel.addNewKeyframe();
    this.rekapiComponent.rekapi.play();
  };

  fn.setInitialState = function () {
    this.model.set({
      cssOrientation: 'first-keyframe'
      ,focusedControlPanelTab: ''
    });
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

  return Stylie;
});
