define([

  'underscore'
  ,'backbone'

  ,'src/app'
  ,'src/model/keyframe'

], function (

  _
  ,Backbone

  ,app
  ,KeyframeModel

) {

  return Backbone.Collection.extend({

    'model': KeyframeModel

    ,'initialize': function (models, opts) {
      _.extend(this, opts);

      this.on('add', _.bind(this.onAdd, this));
    }

    ,'comparator': function (keyframeModel) {
      return keyframeModel.get('millisecond');
    }

    ,'removeKeyframe': function (millisecond) {
      this.remove(this.findWhere({'millisecond': millisecond}));
    }

    ,'onAdd': function (model) {
      this.owner.crosshairsView.addCrosshairView(model);
      this.owner.keyframeFormsView.addKeyframeView(model);
      this.listenTo(model, 'destroy', _.bind(this.onModelDestroy, this, model));
    }

    ,'onModelDestroy': function (model) {
      model.owner.removeKeyframe(model.get('millisecond'));
    }

    /**
     * @param {Object} offsets The properties to offset as keys, and the amount
     * by which to offset them as values.
     */
    ,'offsetKeyframes': function (offsets) {
      this.each(function (keyframeModel) {
        _.each(offsets, function (offsetAmount, offsetName) {
          keyframeModel.set(
            offsetName, keyframeModel.get(offsetName) + offsetAmount);
          keyframeModel.modifyKeyframe();
        }, this);
      });
    }

  });
});
