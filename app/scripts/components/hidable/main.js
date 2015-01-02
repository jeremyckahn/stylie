define([

  'lateralus'

  ,'./view'

], function (

  Lateralus

  ,View

) {
  'use strict';

  var Base = Lateralus.Component;

  var HidableComponent = Base.extend({
    name: 'hidable'
    ,View: View
  });

  return HidableComponent;
});
