define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var CrosshairComponent = Base.extend({
    name: 'crosshair'
    ,View: View
    ,template: template

    ,lateralusEvents: {
      userRequestStartRotationEditMode: function () {
        this.view.startRotationEditMode();
      }

      ,userRequestEndRotationEditMode: function () {
        this.view.endRotationEditMode();
      }
    }
  });

  return CrosshairComponent;
});
