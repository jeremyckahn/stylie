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

  var HelpComponent = Base.extend({
    name: 'help'
    ,View: View
    ,template: template
  });

  return HelpComponent;
});
