define([

  'lateralus'

  ,'shifty'

], function (

  Lateralus

  ,Tweenable

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  // TODO: This really should be part of a Collection, not a singleton Model.
  var BezierizerComponentModel = Base.extend({
    defaults: {
      name: ''
      ,x1: 0.25
      ,y1: 0.5
      ,x2: 0.75
      ,y2: 0.5
    }

    ,lateralusEvents: {
      /**
       * @param {Object} curves
       */
      loadBezierCurves: function (curves) {
        var curve;
        for (curve in curves) {
          this.emit('setCustomCurve', curves[curve]);
        }

        this.emit('selectFirstCurve');
      }
    }

    ,initialize: function () {
      this.on('change', this.onChange.bind(this));
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

    ,onChange: function () {
      var attributes = this.attributes;
      Tweenable.setBezierFunction(
        attributes.name
        ,attributes.x1
        ,attributes.y1
        ,attributes.x2
        ,attributes.y2
      );

      this.emit('bezierCurveUpdated', this);
    }
  });

  return BezierizerComponentModel;
});
