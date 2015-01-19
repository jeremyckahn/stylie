define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'../collections/keyframe-property'

  ,'../../../constant'

], function (

  _
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

      /**
       * @param {boolean} isCentered
       */
      ,userRequestUpdateCenteringSetting: function (isCentered) {
        // TODO: This really belongs in collections/keyframe-property.js, but
        // that currently has no reference to the central Lateralus instance.
        this.transformPropertyCollection.setCenteringRules(isCentered);
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
     * @param {Object} [opt_options]
     * @param {number} [opt_options.millisecond]
     * @param {Object} [opt_options.state]
     * @param {Object} [opt_options.easing]
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
     * Helper method for RekapiComponent#getCssString.
     * @param {{ x: number, y: number }} offset
     */
    ,prepareForCssStringCreation: function (offset) {
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
     * Helper method for RekapiComponent#getCssString.
     * @param {{ x: number, y: number }} offset
     */
    ,cleanupAfterCssStringCreation: function (offset) {
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
  });

  // Proxy all Rekapi.Actor.prototype methods through ActorModel.
  _.each(Rekapi.Actor.prototype, function (fn, fnName) {
    var proxiedFn = function () {
      return fn.apply(this.actor, arguments);
    };

    proxiedFn.displayName = 'proxied-' + fnName;
    ActorModel.prototype[fnName] = proxiedFn;
  });

  return ActorModel;
});
