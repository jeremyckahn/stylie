define([

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'../collections/keyframe-property'

  ,'aenima.component.rekapi'

  ,'aenima.constant'

], function (

  _
  ,Backbone
  ,Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

  ,AEnimaRekapiComponent

  ,constant

) {
  'use strict';

  var Base = AEnimaRekapiComponent.ActorModel;
  var baseProto = Base.prototype;

  var silentOptionObject = { silent: true };

  var ActorModel = Base.extend({
    KeyframePropertyCollection: KeyframePropertyCollection

    ,lateralusEvents: {
      userRequestNewKeyframe: function () {
        this.emit('requestRecordUndoState');
        this.addNewKeyframe();
      }

      ,millisecondEditingEnd: function () {
        this.emit('confirmNewKeyframeOrder', this.transformPropertyCollection);
      }
    }

    /**
     * @param {Object} attributes
     * @param {Object} options
     *   @param {RekapiComponent} rekapiComponent
     *   @param {RekapiActor} actor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @param {Object=} [opt_options]
     * @param {number} [opt_options.millisecond]
     * @param {Object} [opt_options.state]
     * @param {string} [opt_options.easing]
     */
    ,addNewKeyframe: function (opt_options) {
      var options = opt_options || {};
      var keyframePropertyAttributes = options.state || {};
      var transformPropertyCollection = this.transformPropertyCollection;

      if (options.easing) {
        _.extend(keyframePropertyAttributes, { easing: options.easing });
      }

      var millisecond = options.millisecond || 0;

      if (transformPropertyCollection.length && !opt_options) {
        keyframePropertyAttributes =
          transformPropertyCollection.last().toJSON();

        keyframePropertyAttributes.x += constant.NEW_KEYFRAME_X_INCREASE;
        keyframePropertyAttributes.millisecond +=
          constant.NEW_KEYFRAME_MS_INCREASE;

        millisecond = keyframePropertyAttributes.millisecond;
      } else {
        keyframePropertyAttributes.millisecond = millisecond;
      }

      keyframePropertyAttributes.isCentered =
        this.collectOne('cssConfigObject').isCentered;
      keyframePropertyAttributes.isSelected = false;

      // Add the model silently here, the "add" event is fired explicitly later
      // in this function.
      var keyframePropertyModel = transformPropertyCollection.add(
        keyframePropertyAttributes || {}
        ,silentOptionObject
      );

      this.keyframe(millisecond, {
        transform: keyframePropertyModel.getValue()
      }, {
        transform: keyframePropertyModel.getEasing()
      });

      var keyframeProperty =
        this.getKeyframeProperty('transform', millisecond);

      keyframePropertyModel.bindToRawKeyframeProperty(keyframeProperty);

      // Rekapi and the Collection are now in sync, notify the listeners.
      transformPropertyCollection.trigger(
        'add'
        ,keyframeProperty
        ,transformPropertyCollection
      );

      this.emit('keyframePropertyAdded', keyframePropertyModel);
    }

    /**
     * @return {{x: number, y: number}}
     */
    ,getFirstKeyframeOffset: function () {
      var firstKeyframe = this.transformPropertyCollection.first();

      if (!firstKeyframe) {
        return { x: 0, y: 0 };
      }

      var firstKeyframeJson = firstKeyframe.toJSON();

      return {
        x: firstKeyframeJson.x
        ,y: firstKeyframeJson.y
      };
    }

    /**
     * Helper method for RekapiComponent#applyOrientationToExport.
     * @param {{ x: number, y: number }} offset
     */
    ,prepareForExport: function (offset) {
      this.transformPropertyCollection.each(function (model) {
        ['x', 'y'].forEach(function (property) {
          model.set(
            property
            ,model.get(property) - offset[property]
            ,silentOptionObject);

          model.updateRawKeyframeProperty();
        }, this);
      });
    }

    /**
     * Helper method for RekapiComponent#applyOrientationToExport.
     * @param {{ x: number, y: number }} offset
     */
    ,cleanupAfterExport: function (offset) {
      this.transformPropertyCollection.each(function (model) {
        ['x', 'y'].forEach(function (property) {
          model.set(
            property
            ,model.get(property) + offset[property]
            ,silentOptionObject);

          model.updateRawKeyframeProperty();
        }, this);
      });
    }

    /**
     * @param {Array.<Object>} keyframes
     */
    ,setKeyframes: function (keyframes) {
      this.rekapiComponent.beginBulkKeyframeOperation();
      this.removeAllKeyframes();

      keyframes.forEach(function (keyframe) {
        this.addNewKeyframe({
          millisecond: keyframe.millisecond
          ,state: _.omit(keyframe, 'millisecond')
        });
      }, this);

      this.rekapiComponent.endBulkKeyframeOperation();
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,exportForMantra: function () {
      var exportActor = new Rekapi.Actor();
      var transformProperties = this.transformPropertyCollection.toJSON();

      transformProperties.forEach(function (transformProperty) {
        exportActor.keyframe(transformProperty.millisecond, {
          translateX: transformProperty.x + 'px'
          ,translateY: transformProperty.y + 'px'
          ,scale: transformProperty.scale
          ,rotateX: transformProperty.rotationX + 'deg'
          ,rotateY: transformProperty.rotationY + 'deg'
          ,rotateZ: transformProperty.rotationZ + 'deg'
        }, {
          translateX: transformProperty.easing_x
          ,translateY: transformProperty.easing_y
          ,scale: transformProperty.easing_scale
          ,rotateX: transformProperty.easing_rotationX
          ,rotateY: transformProperty.easing_rotationY
          ,rotateZ: transformProperty.easing_rotationZ
        });
      }, this);

      return exportActor;
    }
  });

  return ActorModel;
});
