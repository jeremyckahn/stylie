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

    /**
     * @param {Object} attributes
     */
    ,validate: function (attributes) {
      var nonNumbers = ['x1', 'y1', 'x2', 'y2'].filter(function (value) {
        var attributeValue = attributes[value];
        return typeof attributeValue !== 'number' || isNaN(attributeValue);
      });

      if (nonNumbers.length) {
        return 'Invalid bezier handle values: ' + JSON.stringify(nonNumbers);
      }
    }
  });

  return BezierizerModel;
});
