define([

  'lateralus'

  ,'stylie.component.shifty'
  ,'stylie.component.rekapi'
  ,'stylie.component.container'

], function (

  Lateralus

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
    this.rekapiComponent.addNewKeyframe({
      state: this.getInitialKeyframeState()
    });
  });

  var fn = Stylie.prototype;

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

  return Stylie;
});
