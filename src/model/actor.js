define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/constants'
  ,'src/collection/keyframes'
  ,'src/model/keyframe'
  ,'src/view/keyframe-forms'
  ,'src/view/crosshairs'

], function (

  $
  ,_
  ,Backbone

  ,constant
  ,KeyframeCollection
  ,KeyframeModel
  ,KeyframeFormsView
  ,CrosshairsView

) {

  // TODO: This model needs teardown/cleanup logic.

  return Backbone.Model.extend({

    /**
     * @param {Object} attrs
     * @param {Object} opts
     *   @param {Stylie} stylie
     */
    'initialize': function (attrs, opts) {
      this.stylie = opts.stylie;

      this.keyframeCollection =
          new KeyframeCollection([], { 'stylie': this.stylie });

      this.listenTo(
          this.keyframeCollection, 'sort',
          _.bind(this.onKeyframeCollectionSort, this));

      this.listenTo(this.keyframeCollection,
        'add', _.bind(this.onKeyframeCollectionAdd, this));

      this.keyframeFormsView = new KeyframeFormsView({
        'stylie': this.stylie
        ,'el': document.getElementById('keyframe-controls')
        ,'model': this
      });

      this.crosshairsView = new CrosshairsView({
        'stylie': this.stylie
        ,'el': document.getElementById('crosshairs')
        ,'model': this
      });
    }

    /**
     * @param {KeyframeModel} model
     */
    ,'onKeyframeCollectionAdd': function (model) {
      this.crosshairsView.addCrosshairView(model);
      this.keyframeFormsView.addKeyframeView(model);
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

    ,'onKeyframeCollectionSort': function () {
      this.trigger('change');
      this.stylie.rekapi.update();
      this.stylie.trigger(constant.KEYFRAME_ORDER_CHANGED);
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

      this.stylie.view.canvas.backgroundView.update();
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

    // Rekapi encapsulation methods

    /**
     * @param {number} millisecond
     * @param {Object} properties
     * @param {string|Object} opt_easing
     */
    ,'keyframe': function (millisecond, properties, opt_easing) {
      var transformRule = KeyframeModel.createCSSRuleObject(
          properties.x
          ,properties.y
          ,properties.rX
          ,properties.rY
          ,properties.rZ
          ,this.stylie.config.isCenteredToPath);

      this.attributes.actor.keyframe(millisecond, transformRule, opt_easing);

      var modelProperties = _.extend({
        'millisecond': millisecond
        ,'easing': opt_easing
      }, properties);

      this.keyframeCollection.add(modelProperties, {'actorModel': this});
      var keyframeModel =
          this.keyframeCollection.findWhere({ 'millisecond': millisecond });

      this.listenTo(keyframeModel, 'destroy', _.bind(function () {
        this.removeKeyframe(
            keyframeModel.attributes.millisecond, keyframeModel);
      }, this));

      this.stylie.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    /**
     * @param {number} millisecond
     * @param {Object} stateModification
     * @param {Object=} opt_easingModification
     */
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
      var actor = this.attributes.actor;
      return actor.moveKeyframe.apply(actor, arguments);
    }

    /**
     * @param {number} millisecond
     * @param {KeyframeModel} keyframeModel
     */
    ,'removeKeyframe': function (millisecond, keyframeModel) {
      this.stopListening(keyframeModel);
      this.keyframeCollection.removeKeyframe(millisecond);
      this.get('actor').removeKeyframe(millisecond);
      this.stylie.trigger(constant.PATH_CHANGED);
    }

    ,'importTimeline': function (actorData) {
      _.each(actorData.propertyTracks, function (propertyTrack) {
        _.each(propertyTrack, function (property) {
          var transformObject = this.parseTranformString(property.value);
          this.keyframe(
              property.millisecond, transformObject, property.easing);
        }, this);
      }, this);

      this.stylie.rekapi.update();
      this.stylie.trigger(constant.PATH_CHANGED);
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
