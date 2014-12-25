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

  var Base = Lateralus.Component;

  var RekapiComponent = Base.extend({
    name: 'rekapi'

    ,initialize: function () {
      this.isGeneratingCss = false;
      this.rekapi = new Rekapi(document.body);
      this.rekapiActor = this.rekapi.addActor();
      this.transformPropertyCollection = new KeyframePropertyCollection();

      this.rekapi.on(
        'timelineModified', this.onRekapiTimelineModified.bind(this));

      this.listenFor(
        'requestNewKeyframe'
        ,this.onRequestNewKeyframe.bind(this)
      );

      this.listenFor(
        'millisecondEditingEnd'
        ,this.onMillisecondEditingEnd.bind(this)
      );

      this.listenFor(
        'updateCenteringSetting'
        ,this.onUpdateCenteringSetting.bind(this)
      );
    }

    ,onRekapiTimelineModified: function () {
      // Prevent infinite loops caused by offset adjustment logic.
      if (!this.isGeneratingCss) {
        this.emit('timelineModified');
      }
    }

    ,onRequestNewKeyframe: function () {
      this.addNewKeyframe();
    }

    ,onMillisecondEditingEnd: function () {
      this.emit('confirmNewKeyframeOrder', this.transformPropertyCollection);
    }

    /**
     * @param {boolean} isCentered
     */
    ,onUpdateCenteringSetting: function (isCentered) {
      // TODO: This really belongs in collections/keyframe-property.js, but
      // that currently has no reference to the central Lateralus instance.
      this.transformPropertyCollection.setCenteringRules(isCentered);
    }

    /**
     * @param {Object} [opt_options]
     * @param {number} [opt_options.millisecond]
     * @param {Object} [opt_options.state]
     * @param {Object} [opt_options.easing]
     */
    ,addNewKeyframe: function (opt_options) {
      var options = opt_options || {};
      var keyframePropertyAttributes = options.state || {};

      if (options.easing) {
        _.extend(keyframePropertyAttributes, { easing: options.easing });
      }

      var millisecond = options.millisecond || 0;

      if (this.transformPropertyCollection.length && !opt_options) {
        keyframePropertyAttributes =
          this.transformPropertyCollection.last().toJSON();

        keyframePropertyAttributes.x += constant.NEW_KEYFRAME_X_INCREASE;
        keyframePropertyAttributes.millisecond +=
          constant.NEW_KEYFRAME_MS_INCREASE;

        millisecond = keyframePropertyAttributes.millisecond;
      }

      keyframePropertyAttributes.isCentered =
        this.lateralus.getCssConfigObject().isCentered;

      var keyframePropertyModel =
        this.transformPropertyCollection.add(keyframePropertyAttributes || {});

      this.rekapiActor.keyframe(millisecond, {
        transform: keyframePropertyModel.getValue()
      });

      var keyframeProperty =
        this.rekapiActor.getKeyframeProperty('transform', millisecond);

      keyframePropertyModel.bindToRawKeyframeProperty(keyframeProperty);

      this.emit('keyframePropertyAdded', keyframePropertyModel);
    }

    /**
     * @param {Object} opts Gets passed to Rekapi.DOMRenderer#toString.
     * @return {string}
     */
    ,getCssString: function (opts) {
      var rekapi = this.rekapi;
      var options = { silent: true };
      var firstKeyframeJson, offset;

      this.isGeneratingCss = true;

      if (this.lateralus.cssOrientation === 'first-keyframe') {
        firstKeyframeJson =
          this.transformPropertyCollection.first().toJSON();

        offset = {
          x: firstKeyframeJson.x
          ,y: firstKeyframeJson.y
        };

        this.transformPropertyCollection.each(function (model) {
          ['x', 'y'].forEach(function (property) {
            model.set(
              property, model.get(property) - offset[property], options);
            model.updateRawKeyframeProperty();
          }, this);
        });
      }

      var cssString = rekapi.renderer.toString(opts);

      if (this.lateralus.cssOrientation === 'first-keyframe') {
        this.transformPropertyCollection.each(function (model) {
          ['x', 'y'].forEach(function (property) {
            model.set(
              property, model.get(property) + offset[property], options);
            model.updateRawKeyframeProperty();
          }, this);
        });
      }

      return cssString;
    }
  });

  return RekapiComponent;
});
