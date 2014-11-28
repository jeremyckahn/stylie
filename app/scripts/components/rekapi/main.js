define([

  'underscore'
  ,'lateralus'

  ,'./collections/keyframe-property'

  ,'rekapi'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,KeyframePropertyCollection

  ,Rekapi

  ,constant

) {
  'use strict';

  var RekapiComponent = Lateralus.Component.extend({
    name: 'rekapi'

    ,initialize: function () {
      this.rekapi = new Rekapi();
      this.rekapiActor = this.rekapi.addActor();
      this.transformPropertyCollection = new KeyframePropertyCollection();

      this.listenFor(
        'requestNewKeyframe'
        ,this.onRequestNewKeyframe.bind(this)
      );
    }

    ,onRequestNewKeyframe: function () {
      this.addNewKeyframe();
    }

    /**
     * @param {number} [opt_millisecond] Where on the timeline to place the new
     * keyframe.
     */
    ,addNewKeyframe: function (opt_millisecond) {
      var millisecond = typeof opt_millisecond === 'undefined' ?
        this.rekapi.getAnimationLength() + constant.NEW_KEYFRAME_MS_INCREASE :
        opt_millisecond;

      var transformComponents;

      if (this.transformPropertyCollection.length) {
        transformComponents = this.transformPropertyCollection.last().toJSON();
        transformComponents.x += constant.NEW_KEYFRAME_X_INCREASE;
      }

      var keyframePropertyModel =
        this.transformPropertyCollection.add(transformComponents || {});

      this.rekapiActor.keyframe(millisecond, {
        transform: keyframePropertyModel.toString()
      });

      this.emit('keyframePropertyAdded', keyframePropertyModel);
    }
  });

  return RekapiComponent;
});
