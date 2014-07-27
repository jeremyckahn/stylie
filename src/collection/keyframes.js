define([

  'underscore'
  ,'backbone'

  ,'src/model/keyframe'

], function (

  _
  ,Backbone

  ,KeyframeModel

) {

  return Backbone.Collection.extend({

    model: KeyframeModel

    /**
     * @param {Array.<Object>} models
     * @param {Object} opts
     *   @param {Stylie} stylie
     */
    ,initialize: function (models, opts) {
      this.stylie = opts.stylie;
    }

    /**
     * @param {KeyframeModel} model
     */
    ,comparator: function (model) {
      return model.get('millisecond');
    }

    /**
     * @param {number} millisecond
     */
    ,removeKeyframe: function (millisecond) {
      this.remove(this.findWhere({ millisecond: millisecond }));
    }

    /**
     * @param {Object} offsets The properties to offset as keys, and the amount
     * by which to offset them as values.
     */
    ,offsetKeyframes: function (offsets) {
      this.each(function (keyframeModel) {
        _.each(offsets, function (offsetAmount, offsetName) {
          keyframeModel.set(
            offsetName, keyframeModel.get(offsetName) + offsetAmount);
        }, this);
      });
    }

  });
});
