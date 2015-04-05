define([

  'underscore'
  ,'lateralus'

  ,'text!./templates/beacon-rule.mustache'

  ,'./models/actor'

  ,'./collections/keyframe-property'

  ,'rekapi'

], function (

  _
  ,Lateralus

  ,beaconRuleTemplate

  ,ActorModel

  ,KeyframePropertyCollection

  ,Rekapi

) {
  'use strict';

  var Base = Lateralus.Component;

  var RekapiComponent = Base.extend({
    name: 'rekapi'

    ,lateralusEvents: {
      /**
       * @param {BezierizerComponentModel} bezierComponentModel
       */
      bezierCurveUpdated: function (bezierComponentModel) {
        this.saveBezierCurve(bezierComponentModel);
      }

      /**
       * @param {string} curveName
       */
      ,unsetBezierFunction: function (curveName) {
        delete this.bezierCurves[curveName];
        this.onRekapiTimelineModified();
      }

      ,userRequestPlay: function () {
        this.rekapi.playFromCurrent();
      }

      ,userRequestPause: function () {
        this.rekapi.pause();
      }

      ,userRequestStop: function () {
        this.rekapi.stop();
        this.rekapi.update(0);
      }

      /**
       * @param {number} millisecond
       */
      ,userRequestSetPlayheadMillisecond: function (millisecond) {
        this.rekapi.update(millisecond);
      }

      ,userRequestTogglePreviewPlayback: function () {
        var rekapi = this.rekapi;
        rekapi[rekapi.isPlaying() ? 'pause' : 'playFromCurrent']();
      }
    }

    ,initialize: function () {
      this.rekapi = new Rekapi(document.body);
      this.isPerformingBulkOperation = false;
      this.bezierCurves = {};
      this.setupActor();

      this.rekapi.on(
        'playStateChange'
        ,this.onRekapiPlayStateChanged.bind(this)
      );

      this.rekapi.on(
        'afterUpdate'
        ,this.onRekapiAfterUpdate.bind(this)
      );
    }

    ,onRekapiTimelineModified: function () {
      if (this.isPerformingBulkOperation) {
        return;
      }

      this.rekapi.update();
      this.emit('timelineModified', this);
    }

    ,onRekapiPlayStateChanged: function () {
      this.emit('rekapiPlayStateChange', this.rekapi.isPlaying());
    }

    ,onRekapiAfterUpdate: function () {
      this.emit('animationHasUpdated', this);
    }

    ,setupActor: function () {
      var newActor = this.rekapi.addActor();
      this.actorModel = this.initModel(ActorModel, {}, {
        rekapiComponent: this
        ,actor: newActor
      });

      this.listenTo(
        this.actorModel
        ,'change'
        ,this.onRekapiTimelineModified.bind(this)
      );
    }

    /**
     * @param {Object} opts Gets passed to Rekapi.DOMRenderer#toString.
     * @return {string}
     */
    ,getCssString: function (opts) {
      return this.applyOrientationToExport(function () {
        var cssString = this.rekapi.renderer.toString(opts);
        cssString += beaconRuleTemplate;

        return cssString;
      });
    }

    /**
     * @return {Object}
     */
    ,getTimelineExportObject: function () {
      return this.applyOrientationToExport(function () {
        return this.rekapi.exportTimeline();
      });
    }

    /**
     * @param {Function} exportProcessor
     * @return {*}
     */
    ,applyOrientationToExport: function (exportProcessor) {
      var needToAccountForOffset =
        this.lateralus.getUi('exportOrientation') === 'first-keyframe';

      var offset = this.actorModel.getFirstKeyframeOffset();

      if (needToAccountForOffset) {
        this.actorModel.prepareForExport(offset);
      }

      var exportedAnimation = exportProcessor.call(this);

      if (needToAccountForOffset) {
        this.actorModel.cleanupAfterExport(offset);
      }

      return exportedAnimation;
    }

    /**
     * Prevent repeated calls to this.rekapi.update() until
     * endBulkKeyframeOperation is called.
     */
    ,beginBulkKeyframeOperation: function () {
      this.isPerformingBulkOperation = true;
    }

    ,endBulkKeyframeOperation: function () {
      this.isPerformingBulkOperation = false;
      this.onRekapiTimelineModified();
    }

    /**
     * @return {Object}
     */
    ,toJSON: function () {
      return {
        actorModel: this.actorModel.toJSON()
        ,bezierCurves: this.bezierCurves
      };
    }

    /**
     * @param {string} animationName
     */
    ,fromJSON: function (animationName) {
      this.clearCurrentAnimation();
      var animationData =
        this.lateralus.model.get('savedAnimations')[animationName];

      this.emit('loadBezierCurves', animationData.bezierCurves);
      this.actorModel.setKeyframes(
        animationData.actorModel.transformPropertyCollection);

    }

    ,clearCurrentAnimation: function () {
      this.actorModel.removeAllKeyframes();
    }

    /**
     * @param {BezierizerComponentModel} bezierComponentModel
     */
    ,saveBezierCurve: function (bezierComponentModel) {
      var bezierCurveJson = bezierComponentModel.toJSON();
      this.bezierCurves[bezierCurveJson.name] = bezierCurveJson;
      this.onRekapiTimelineModified();
    }
  });

  return RekapiComponent;
});
