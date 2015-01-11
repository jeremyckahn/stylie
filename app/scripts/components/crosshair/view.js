define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var CrosshairComponentView = Base.extend({
    template: template

    ,events: {
      drag: function () {
        this.setUiStateToModel();
      }
    }

    /**
     * @param {Object} options See http://backbonejs.org/#View-constructor
     * @param {KeyframePropertyModel} options.model
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change', this.onModelChange.bind(this));
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.$el.parent()
      });

      this.render();
    }

    /**
     * @param {KeyframePropertyModel} model
     * @param {Object} options
     * @param {boolean} options.changedByCrosshairView
     */
    ,onModelChange: function (model, options) {
      if (!options.changedByCrosshairView) {
        this.render();
      }
    }

    ,render: function () {
      this.$el.css({
        top: this.model.get('y')
        ,left: this.model.get('x')
      });
    }

    ,setUiStateToModel: function () {
      this.model.set({
        x: parseInt(this.$el.css('left'))
        ,y: parseInt(this.$el.css('top'))
      }, {
        changedByCrosshairView: true
      });
    }
  });

  return CrosshairComponentView;
});
