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

  var HtmlPanelComponent = Base.extend({
    name: 'html-panel'
    ,View: View
    ,template: template
  });

  return HtmlPanelComponent;
});
