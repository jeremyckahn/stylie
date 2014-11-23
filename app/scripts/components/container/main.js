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

  var ContainerComponent = Lateralus.Component.extend({
    name: 'container'
    ,View: View
    ,template: template
  });

  return ContainerComponent;
});
