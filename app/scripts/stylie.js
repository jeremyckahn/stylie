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

    this.shiftyComponent = this.addComponent(ShiftyComponent);
    this.rekapiComponent = this.addComponent(RekapiComponent);
    this.containerComponent = this.addComponent(ContainerComponent);

    this.shiftyComponent.createNewCurve();
    this.rekapiComponent.addNewKeyframe();
  });

  return Stylie;
});
