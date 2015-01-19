define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  // These don't return anything
  ,'jquery-mousewheel'
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

      ,'change .rotation-control': function () {
        this.setUiStateToModel();
        this.render();
      }
    }

    /**
     * @param {Object} options See http://backbonejs.org/#View-constructor
     * @param {KeyframePropertyModel} options.model
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change', this.onModelChange.bind(this));
      this.listenTo(this.model, 'destroy', this.onModelDestroy.bind(this));

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

    ,onModelDestroy: function () {
      this.component.dispose();
    }

    ,render: function () {
      var json = this.model.toJSON();
      var halfBoxSize = this.$el.height() / 2;

      // Orient to the center of the crosshair, not the top-left
      this.$el.css({
        top: json.y - halfBoxSize
        ,left: json.x - halfBoxSize
      });

      this.$dashmarkContainer.css(
        'transform', this.getRotationTransformStringFromModel());

      this.$rotationControl.cubeletSetCoords({
        x: json.rotationX
        ,y: json.rotationY
        ,z: json.rotationZ
        ,scale: json.scale
      });
    }

    /**
     * @return {string}
     */
    ,getRotationTransformStringFromModel: function () {
      var json = this.model.toJSON();

      return 'rotateX(' + json.rotationX +
          'deg) rotateY(' + json.rotationY +
          'deg) rotateZ(' + json.rotationZ +
          'deg) scale(' + json.scale + ')';
    }

    ,setUiStateToModel: function () {
      var cubeletCoords = this.$rotationControl.cubeletGetCoords();
      var halfBoxSize = this.$el.height() / 2;

      this.model.set({
        // Orient to the center of the crosshair, not the top-left
        x: parseInt(this.$el.css('left')) + halfBoxSize
        ,y: parseInt(this.$el.css('top')) + halfBoxSize

        ,rotationX: cubeletCoords.x
        ,rotationY: cubeletCoords.y
        ,rotationZ: cubeletCoords.z
        ,scale: cubeletCoords.scale
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
