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

    ,addNewKeyframe: function () {
      var keyframePropertyAttributes;
      var millisecond = 0;

      if (this.transformPropertyCollection.length) {
        keyframePropertyAttributes =
          this.transformPropertyCollection.last().toJSON();

        keyframePropertyAttributes.x += constant.NEW_KEYFRAME_X_INCREASE;
        keyframePropertyAttributes.millisecond +=
          constant.NEW_KEYFRAME_MS_INCREASE;

        millisecond = keyframePropertyAttributes.millisecond;
      }

      var keyframePropertyModel =
        this.transformPropertyCollection.add(keyframePropertyAttributes || {});

      this.rekapiActor.keyframe(millisecond, {
        transform: keyframePropertyModel.toString()
      });

      this.emit('keyframePropertyAdded', keyframePropertyModel);
    }
  });

  return RekapiComponent;
});
