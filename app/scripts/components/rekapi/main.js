define([

  'underscore'
  ,'lateralus'

  ,'text!./templates/transform-string.mustache'

  ,'mustache'
  ,'rekapi'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,transformStringTemplate

  ,Mustache
  ,Rekapi

  ,constant

) {
  'use strict';

  var INITIAL_TRANSFORM = {
    x: 0
    ,y: 0
    ,scale: 1
    ,rotationX: 0
    ,rotationY: 0
    ,rotationZ: 0
  };

  var RekapiComponent = Lateralus.Component.extend({
    name: 'rekapi'

    ,initialize: function () {
      this.rekapi = new Rekapi();
      this.rekapiActor = this.rekapi.addActor();
      this.addNewKeyframe(0);

      this.listenTo(
        this.lateralus
        ,'requestNewKeyframe'
        ,this.onRequestNewKeyframe.bind(this)
      );
    }

    ,onRequestNewKeyframe: function () {
      this.addNewKeyframe();
    }

    /**
     * @param {Object} transformObject
     * @param {number} transformObject.x
     * @param {number} transformObject.y
     * @param {number} transformObject.scale
     * @param {number} transformObject.rotationX
     * @param {number} transformObject.rotationY
     * @param {number} transformObject.rotationZ
     * @param {boolean} [transformObject.isCentered]
     * @return {string}
     */
    ,getFormattedTransformString: function (transformObject) {
      return Mustache.render(
        // Strip out any newlines
        transformStringTemplate.replace(/\n/g,''), transformObject);
    }

    /**
     * @param {number} [opt_millisecond] Where on the timeline to place the new
     * keyframe.
     */
    ,addNewKeyframe: function (opt_millisecond) {
      var millisecond = typeof opt_millisecond === 'undefined' ?
        this.rekapi.getAnimationLength() + constant.NEW_KEYFRAME_MS_INCREASE :
        opt_millisecond;

      var transformProperties =
        this.rekapiActor.getPropertiesInTrack('transform');

      var rawTransformData;

      if (transformProperties) {
        rawTransformData = _.last(transformProperties).rawTransformData;
        rawTransformData.x += constant.NEW_KEYFRAME_X_INCREASE;
      } else {
        rawTransformData = INITIAL_TRANSFORM;
      }

      this.rekapiActor.keyframe(millisecond, {
        transform: this.getFormattedTransformString(rawTransformData)
      });

      var newKeyframeProperty =
        this.rekapiActor.getKeyframeProperty('transform', millisecond);
      newKeyframeProperty.rawTransformData = rawTransformData;
    }
  });

  return RekapiComponent;
});
