define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'bezierizer'

], function (

  _
  ,Lateralus

  ,template

  ,Bezierizer

) {
  'use strict';

  var MotionPanelComponentView = Lateralus.Component.View.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);

      _.defer(this.initBezierizer.bind(this));
    }

    ,initBezierizer: function () {
      this.bezierizer = new Bezierizer(this.$bezierizer[0]);
    }
  });

  return MotionPanelComponentView;
});
