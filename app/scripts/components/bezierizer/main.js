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

  var BezierizerComponent = Lateralus.Component.extend({
    name: 'bezierizer'
    ,View: View
    ,template: template
  });

  return BezierizerComponent;
});
