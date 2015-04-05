define([

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'../collections/keyframe-property'

  ,'../../../constant'

], function (

  _
  ,Backbone
  ,Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var silentOptionObject = { silent: true };

  var ActorModel = Base.extend({
    defaults: {
    }

    ,lateralusEvents: {
      userRequestNewKeyframe: function () {
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
    ,initialize: function (attributes, options) {
      this.rekapiComponent = options.rekapiComponent;
      this.actor = options.actor;

      this.transformPropertyCollection =
        this.initCollection(KeyframePropertyCollection);

      this.listenTo(
        this.transformPropertyCollection
        ,'change add remove'
        ,this.onMutateTransformPropertyCollection.bind(this)
      );
    }

    ,onMutateTransformPropertyCollection: function () {
      this.trigger('change');
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
        this.lateralus.getCssConfigObject().isCentered;

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

    ,removeAllKeyframes: function () {
      var transformPropertyCollection = this.transformPropertyCollection;

      // Prevent the internal Backbone.Collection operations from happening
      // while models are being removed.
      var safeCopy = transformPropertyCollection.models.slice();

      safeCopy.forEach(
        transformPropertyCollection.remove, transformPropertyCollection);
    }

    /**
     * @override
     */
    ,toJSON: function () {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

      json.transformPropertyCollection =
        this.transformPropertyCollection.toJSON();

      return json;
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
  });

  var fn = ActorModel.prototype;

  // Proxy all Rekapi.Actor.prototype methods through ActorModel.
  _.each(Rekapi.Actor.prototype, function (protoFn, fnName) {
    // Don't overwrite pre-existing prototype methods.
    if (fn[fnName]) {
      return;
    }

    var proxiedFn = function () {
      return protoFn.apply(this.actor, arguments);
    };

    proxiedFn.displayName = 'proxied-' + fnName;
    fn[fnName] = proxiedFn;
  });

  return ActorModel;
});
