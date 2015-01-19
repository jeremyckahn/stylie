define([

  'underscore'
  ,'lateralus'

  ,'stylie.component.shifty'
  ,'stylie.component.rekapi'
  ,'stylie.component.container'

], function (

  _
  ,Lateralus

  ,ShiftyComponent
  ,RekapiComponent
  ,ContainerComponent

) {
  'use strict';

  /**
   * @param {Element} el
   * @extends {Lateralus}
   * @constuctor
   */
  var Stylie = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);

    this.model.set({
      cssOrientation: 'first-keyframe'
    });

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

  return Stylie;
});
