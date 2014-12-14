define([

  'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.curve-selector'

], function (

  Lateralus

  ,template

  ,CurveSelectorComponent

) {
  'use strict';

  var MotionPanelComponentView = Lateralus.Component.View.extend({
    template: template

    ,events: {
      'click .add-curve': 'onClickAddCurve'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
      this.addSubview(CurveSelectorComponent.View, {
        el: this.$curveSelector
      });
    }

    ,onClickAddCurve: function () {
      this.emit('userRequestedNewCurve');
    }
  });

  return MotionPanelComponentView;
});
