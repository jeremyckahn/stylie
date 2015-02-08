define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ModalComponent = Base.extend({
    name: 'modal'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ModalComponent;
});
