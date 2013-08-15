define(['src/app', 'src/constants', 'src/collection/keyframes'
    ,'src/ui/keyframe-forms', 'src/ui/crosshairs'],

    function (app, constant, KeyframeCollection
      ,KeyframeFormsView, CrosshairsView) {

  return Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);
      this.keyframeCollection = new KeyframeCollection([], {'owner': this});

      this.keyframeFormsView = new KeyframeFormsView({
        '$el': $('#keyframe-controls')
        ,'model': this
      });

      this.crosshairsView = new CrosshairsView({
        '$el': $('#crosshairs')
        ,'model': this
      });
    }

    ,'getLength': function () {
      return this.keyframeCollection.length;
    }

    ,'getAttrsForKeyframe': function (index) {
      return this.keyframeCollection.at(index).getAttrs();
    }

    ,'getMillisecondOfKeyframe': function (index) {
      return +this.keyframeCollection.at(index).get('millisecond');
    }

    ,'getKeyframeFormViews': function () {
      return _.pluck(this.keyframeCollection.models, 'keyframeFormView');
    }

    ,'getCrosshairViews': function () {
      return _.pluck(this.keyframeCollection.models, 'crosshairView');
    }

    // TODO: It's really odd that the Actor Model knows about keyframe easings,
    // but the Keyframe Model does not.  This logic should be done in the Actor
    // Model.
    ,'getEasingsForKeyframe': function (index) {
      var keyframeProperty =
          this.get('actor').getKeyframeProperty('transform', index);
      var easingChunks = keyframeProperty.easing.split(' ');

      return {
        'x': easingChunks[0]
        ,'y': easingChunks[1]
        ,'r': easingChunks[2]
      };
    }

    ,'updateKeyframeFormViews': function () {
      this.keyframeCollection.updateModelFormViews();
    }

    ,'updateKeyframeCrosshairViews': function () {
      this.keyframeCollection.updateModelCrosshairViews();
    }

    ,'refreshKeyframeOrder': function () {
      this.keyframeCollection.sort();
      this.keyframeFormsView.reorderKeyframeFormViews();
      this.crosshairsView.reorderCrosshairViews();
      app.kapi.update();
      publish(constant.KEYFRAME_ORDER_CHANGED);
    }

    ,'appendNewKeyframeWithDefaultProperties': function () {
      var lastKeyframeIndex = this.getLength() - 1;
      var lastKeyframeMillisecond =
          this.getMillisecondOfKeyframe(lastKeyframeIndex);
      var lastKeyframeAttrs =
          this.getAttrsForKeyframe(lastKeyframeIndex);
      var newKeyframeMillisecond =
          lastKeyframeMillisecond + constant.NEW_KEYFRAME_MILLISECOND_OFFSET;

      this.keyframe(newKeyframeMillisecond, {
        'x': lastKeyframeAttrs.x + constant.NEW_KEYFRAME_X_OFFSET
        ,'y': lastKeyframeAttrs.y
      ,'rX': 0
      ,'rY': 0
      ,'rZ': 0
      }, 'linear');

      app.view.canvas.backgroundView.update();
    }

    // Kapi encapsulation methods

    /**
     * @param {number} millisecond
     * @param {Object} properties
     * @param {string|Object} opt_easing
     */
    ,'keyframe': function (millisecond, properties, opt_easing) {
      var modelProperties = _.extend({'millisecond': millisecond}, properties);
      this.keyframeCollection.add(modelProperties, { 'owner': this });
      var keyframeProperties = this.keyframeCollection.last().getCSS();
      this.get('actor').keyframe(millisecond, keyframeProperties, opt_easing);
      publish(constant.UPDATE_CSS_OUTPUT);
    }

    ,'modifyKeyframe': function (
        millisecond, stateModification, opt_easingModification) {
      var actor = this.get('actor');
      actor.modifyKeyframe.apply(actor, arguments);
    }

    ,'hasKeyframeAt': function (millisecond) {
      var actor = this.get('actor');
      return actor.hasKeyframeAt.apply(actor, arguments);
    }

    ,'moveKeyframe': function (from, to) {
      var actor = this.get('actor');
      return actor.moveKeyframe.apply(actor, arguments);
    }

    ,'removeKeyframe': function (millisecond) {
      this.keyframeCollection.removeKeyframe(millisecond);
      this.get('actor').removeKeyframe(millisecond);
      publish(constant.PATH_CHANGED);
    }

  });
});
