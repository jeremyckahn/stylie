define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  // Doesn't return anything
  ,'jquery-cubelet'

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

      this.$rotationControl
        .cubeletInit()
        .cubeletHide();

      // The element must be hidden upon initial render to prevent a brief
      // flash of it being in the wrong position.  It is shown after being
      // positioned in deferredInitialize.
      this.$el.css('display', 'none');
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.$el.parent()
      });

      this.render();
      this.$el.css('display', '');
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
      var get = this.model.get.bind(this.model);

      this.$el.css({
        top: get('y')
        ,left: get('x')
        ,transform: this.getRotationTransformStringFromModel()
      });
    }

    /**
     * @return {string}
     */
    ,getRotationTransformStringFromModel: function () {
      var get = this.model.get.bind(this.model);

      return 'rotateX(' + get('rotationX') +
          'deg) rotateY(' + get('rotationY') +
          'deg) rotateZ(' + get('rotationZ') +
          'deg) scale(' + get('scale') + ')';
    }

    ,setUiStateToModel: function () {
      this.model.set({
        x: parseInt(this.$el.css('left'))
        ,y: parseInt(this.$el.css('top'))
      }, {
        changedByCrosshairView: true
      });
    }

    ,startRotationEditMode: function () {
      this.$el.dragonDisable();
      this.$rotationControl.cubeletShow();
    }

    ,endRotationEditMode: function () {
      this.$el.dragonEnable();
      this.$rotationControl.cubeletHide();
    }
  });

  return CrosshairComponentView;
});
