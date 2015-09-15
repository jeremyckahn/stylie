define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'./models/actor'

  ,'aenima.component.rekapi'

], function (

  _
  ,Lateralus
  ,Rekapi

  ,ActorModel

  ,AEnimaRekapiComponent

) {
  'use strict';

  var Base = AEnimaRekapiComponent;
  var baseProto = Base.prototype;

  var RekapiComponent = Base.extend({
    name: 'rekapi'

    ,ActorModel: ActorModel

    ,provide: _.defaults({
      /**
       * @return {Object}
       */
      timelineExport: function () {
        return this.applyOrientationToExport(
          baseProto.provide.timelineExport.bind(this));
      }

      /**
       * @param {Object} cssOpts Gets passed to Rekapi.DOMRenderer#toString.
       * @return {string}
       */
      ,cssAnimationString: function (cssOpts) {
        return this.applyOrientationToExport(
          baseProto.provide.cssAnimationString.bind(this, cssOpts));
      }

      /**
       * TODO: Perhaps this can be provided from the ActorModel class itself?
       * @return {ActorModel}
       */
      ,currentActorModel: function () {
        return this.actorModel;
      }
    }, baseProto.provide)

    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.setupActor();
    }

    /**
     * @param {Function} exportProcessor
     * @return {*}
     */
    ,applyOrientationToExport: function (exportProcessor) {
      var needToAccountForOffset =
        this.lateralus.model.getUi('exportOrientation') === 'first-keyframe';

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
     * @return {Object}
     */
    ,toJSON: function () {
      return {
        actorModel: this.actorModel.toJSON()
        ,bezierCurves: this.bezierCurves
      };
    }

    /**
     * @return {Object}
     */
    ,exportTimelineForMantra: function () {
      var exportRekapi = new Rekapi();
      exportRekapi.addActor(this.actorModel.exportForMantra());

      return exportRekapi.exportTimeline();
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
  });

  return RekapiComponent;
});
