define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'minpubsub'

  ,'src/app'
  ,'src/constants'
  ,'src/collection/keyframes'
  ,'src/ui/keyframe-forms'
  ,'src/ui/crosshairs'

], function (

  $
  ,_
  ,Backbone
  ,MinPubSub

  ,app
  ,constant
  ,KeyframeCollection
  ,KeyframeFormsView
  ,CrosshairsView

) {

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

    ,'updateKeyframes': function () {
      this.keyframeCollection.trigger('change');
    }

    ,'refreshKeyframeOrder': function () {
      this.keyframeCollection.sort();
      this.trigger('change');
      app.kapi.update();
      MinPubSub.publish(constant.KEYFRAME_ORDER_CHANGED);
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
        'x': this.getNewKeyframeX(lastKeyframeAttrs.x)
        ,'y': lastKeyframeAttrs.y
      ,'rX': 0
      ,'rY': 0
      ,'rZ': 0
      }, 'linear');

      app.view.canvas.backgroundView.update();
    }

    ,'getNewKeyframeX': function (lastKeyframeX) {
      var newKeyframeX = lastKeyframeX + constant.NEW_KEYFRAME_X_OFFSET;
      var $crosshairEl = this.crosshairsView.$el.find('.crosshair');
      var maxX = $crosshairEl.parent().width() - ($crosshairEl.width() / 2);
      return Math.min(newKeyframeX, maxX);
    }

    ,'removeAllKeyframes': function () {
      var copiedList = this.keyframeCollection.models.slice(0);
      _.each(copiedList, function (keyframeModel) {
        keyframeModel.destroy();
      });
    }

    // Kapi encapsulation methods

    /**
     * @param {number} millisecond
     * @param {Object} properties
     * @param {string|Object} opt_easing
     */
    ,'keyframe': function (millisecond, properties, opt_easing) {
      var modelProperties = _.extend({
        'millisecond': millisecond
        ,'easing': opt_easing
      }, properties);
      this.keyframeCollection.add(modelProperties, {'owner': this});
      var keyframeProperties = this.keyframeCollection.last().getCSS();
      this.get('actor').keyframe(millisecond, keyframeProperties, opt_easing);
      MinPubSub.publish(constant.UPDATE_CSS_OUTPUT);
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
      MinPubSub.publish(constant.PATH_CHANGED);
    }

    ,'importTimeline': function (actorData) {
      _.each(actorData.propertyTracks, function (propertyTrack) {
        _.each(propertyTrack, function (property) {
          var transformObject = this.parseTranformString(property.value);
          this.keyframe(
              property.millisecond, transformObject, property.easing);
        }, this);
      }, this);

      app.kapi.update();
      MinPubSub.publish(constant.PATH_CHANGED);
    }

    ,'parseTranformString': function (transformString) {
      var chunks = transformString.match(/(-|\d|\.)+/g);

      return {
        'x': +chunks[0]
        ,'y': +chunks[1]
        ,'rX': +chunks[2]
        ,'rY': +chunks[3]
        ,'rZ': +chunks[4]
      };
    }

  });
});
