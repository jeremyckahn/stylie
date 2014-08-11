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
    initialize: function (attrs, opts) {
      this.stylie = opts.stylie;

      this.keyframeCollection =
          new KeyframeCollection([], { stylie: this.stylie });

      this.listenTo(
          this.keyframeCollection, 'sort',
          _.bind(this.onKeyframeCollectionSort, this));

      this.listenTo(this.keyframeCollection,
        'add', _.bind(this.onKeyframeCollectionAdd, this));

      this.keyframeFormsView = new KeyframeFormsView({
        stylie: this.stylie
        ,el: document.getElementById('keyframe-controls')
        ,model: this
      });

      this.crosshairsView = new CrosshairsView({
        stylie: this.stylie
        ,el: document.getElementById('crosshairs')
        ,model: this
      });
    }

    /**
     * @param {KeyframeModel} model
     */
    ,onKeyframeCollectionAdd: function (model) {
      this.crosshairsView.addCrosshairView(model);
      this.keyframeFormsView.addKeyframeView(model);
    }

    ,getLength: function () {
      return this.keyframeCollection.length;
    }

    ,getAttrsForKeyframe: function (index) {
      return this.keyframeCollection.at(index).getAttrs();
    }

    ,getMillisecondOfKeyframe: function (index) {
      return +this.keyframeCollection.at(index).get('millisecond');
    }

    ,onKeyframeCollectionSort: function () {
      this.trigger('change');
      this.stylie.trigger(constant.KEYFRAME_ORDER_CHANGED);
    }

    ,appendNewKeyframeWithDefaultProperties: function () {
      var lastKeyframeIndex = this.getLength() - 1;
      var lastKeyframeMillisecond =
          this.getMillisecondOfKeyframe(lastKeyframeIndex);
      var lastKeyframeAttrs =
          this.getAttrsForKeyframe(lastKeyframeIndex);
      var newKeyframeMillisecond =
          lastKeyframeMillisecond + constant.NEW_KEYFRAME_MILLISECOND_OFFSET;

      this.keyframe(newKeyframeMillisecond, {
        x: this.getNewKeyframeX(lastKeyframeAttrs.x)
        ,y: lastKeyframeAttrs.y
        ,scale: 1
        ,rX: 0
        ,rY: 0
        ,rZ: 0
      }, 'linear');

      this.stylie.view.canvas.backgroundView.update();
    }

    ,getNewKeyframeX: function (lastKeyframeX) {
      var newKeyframeX = lastKeyframeX + constant.NEW_KEYFRAME_X_OFFSET;
      var $crosshairEl = this.crosshairsView.$el.find('.crosshair');
      var maxX = $crosshairEl.parent().width() - ($crosshairEl.width() / 2);
      return Math.min(newKeyframeX, maxX);
    }

    ,removeAllKeyframes: function () {
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
    ,keyframe: function (millisecond, properties, opt_easing) {
      var transformRule = KeyframeModel.createCSSRuleObject(
          properties.x
          ,properties.y
          ,properties.scale
          ,properties.rX
          ,properties.rY
          ,properties.rZ
          ,this.attributes.isCenteredToPath);

      this.attributes.actor.keyframe(millisecond, transformRule, opt_easing);

      var modelProperties = _.extend({
        millisecond: millisecond
        ,easing: opt_easing
      }, properties);

      this.keyframeCollection.add(modelProperties, { actorModel: this });
      var keyframeModel =
          this.keyframeCollection.findWhere({ millisecond: millisecond });

      this.listenTo(keyframeModel, 'change', _.bind(function () {
        this.trigger('change');
      }, this));

      this.listenTo(keyframeModel, 'destroy', _.bind(function () {
        this.removeKeyframe(
            keyframeModel.attributes.millisecond, keyframeModel);
      }, this));

      this.stylie.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    /**
     * @param {number} millisecond
     */
    ,hasKeyframeAt: function (millisecond) {
      var actor = this.get('actor');
      return actor.hasKeyframeAt.apply(actor, arguments);
    }

    /**
     * @param {number} from
     * @param {number} to
     */
    ,moveKeyframe: function (from, to) {
      if (this.hasKeyframeAt(to)) {
        if (from !== to) {
          this.stylie.trigger(constant.ALERT_ERROR,
              'There is already a keyframe at millisecond ' + to + '.');
        }

        return;
      }

      var actor = this.attributes.actor;
      actor.moveKeyframe.apply(actor, arguments);

      var keyframeModel =
          this.keyframeCollection.findWhere({ millisecond: from });

      keyframeModel.set('millisecond', to);
      this.keyframeCollection.sort();
    }

    /**
     * @param {number} millisecond
     * @param {KeyframeModel} keyframeModel
     */
    ,removeKeyframe: function (millisecond, keyframeModel) {
      this.stopListening(keyframeModel);
      this.keyframeCollection.removeKeyframe(millisecond);
      this.get('actor').removeKeyframe(millisecond);
      this.stylie.trigger(constant.PATH_CHANGED);
    }

    ,importTimeline: function (actorData) {
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

    ,parseTranformString: function (transformString) {
      var chunks = transformString.match(/(-|\d|\.)+/g);

      return {
        x: +chunks[0]
        ,y: +chunks[1]
        ,scale: +chunks[2]
        ,rX: +chunks[3]
        ,rY: +chunks[4]
        ,rZ: +chunks[5]
      };
    }

  });
});
