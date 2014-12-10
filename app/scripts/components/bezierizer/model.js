define([

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var BezierizerModel = Lateralus.Component.Model.extend({
    defaults: {
      x1: 0.25
      ,y1: 0.5
      ,x2: 0.75
      ,y2: 0.5
    }
  });

  return BezierizerModel;
});
