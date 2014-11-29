define([

  'lateralus'

  ,'stylie.component.rekapi'
  ,'stylie.component.container'

], function (

  Lateralus

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

    this.rekapiComponent = this.addComponent(RekapiComponent);
    this.containerComponent = this.addComponent(ContainerComponent);

    this.rekapiComponent.addNewKeyframe();
  });

  return Stylie;
});
