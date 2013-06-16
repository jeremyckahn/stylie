define(['src/app', 'src/constants', 'src/collection/keyframes'],
    function (app, constant, KeyframeCollection) {
  return Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);
      this.keyframeCollection = new KeyframeCollection();
    }

    ,'getLength': function () {
      return this.keyframeCollection.length;
    }

    ,'moveLastKeyframe': function (to) {
      this.keyframeCollection.last().moveKeyframe(to);
    }

    ,'getAttrsForKeyframe': function (index) {
      return this.keyframeCollection.at(index).getAttrs();
    }

    ,'updateKeyframeFormViews': function () {
      this.keyframeCollection.updateModelFormViews();
    }

    ,'updateKeyframeCrosshairViews': function () {
      this.keyframeCollection.updateModelCrosshairViews();
    }

    // Kapi encapsulation methods

    /**
     * @param {number} millisecond
     * @param {Object} properties
     * @param {string|Object} opt_easing
     */
    ,'keyframe': function (millisecond, properties, opt_easing) {
      var modelProperties = _.extend({'millisecond': millisecond}, properties);
      this.keyframeCollection.add(modelProperties);
      var keyframeProperties = this.keyframeCollection.last().getCSS();
      this.get('actor').keyframe(millisecond, keyframeProperties, opt_easing);
    }

    ,'modifyKeyframe': function (
        millisecond, stateModification, opt_easingModification) {
      var actor = this.get('actor');
      actor.modifyKeyframe.apply(actor, arguments);
    }

    ,'moveKeyframe': function (from, to) {
      var actor = this.get('actor');
      actor.moveKeyframe.apply(actor, arguments);
    }

  });
});
