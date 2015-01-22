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

  var HtmlPanelComponent = Base.extend({
    name: 'html-panel'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return HtmlPanelComponent;
});
