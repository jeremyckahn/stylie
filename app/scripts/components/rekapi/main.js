define([

  'underscore'
  ,'lateralus'

  ,'./models/actor'

  ,'./collections/keyframe-property'

  ,'rekapi'

], function (

  _
  ,Lateralus

  ,ActorModel

  ,KeyframePropertyCollection

  ,Rekapi

) {
  'use strict';

  var Base = Lateralus.Component;

  var RekapiComponent = Base.extend({
    name: 'rekapi'

    ,initialize: function () {
      this.isGeneratingCss = false;
      this.rekapi = new Rekapi(document.body);
      this.setupActor();

      this.rekapi.on(
        'timelineModified', this.onRekapiTimelineModified.bind(this));
    }

    ,onRekapiTimelineModified: function () {
      // Prevent infinite loops caused by offset adjustment logic.
      if (!this.isGeneratingCss) {
        this.emit('timelineModified', this);
      }
    }

    ,setupActor: function () {
      var newActor = this.rekapi.addActor();
      this.actorModel = this.initModel(ActorModel, {}, {
        rekapiComponent: this
        ,actor: newActor
      });
    }

    /**
     * @param {Object} opts Gets passed to Rekapi.DOMRenderer#toString.
     * @return {string}
     */
    ,getCssString: function (opts) {
      var rekapi = this.rekapi;
      var needToAccountForOffset =
        this.lateralus.model.get('cssOrientation') === 'first-keyframe';

      this.isGeneratingCss = true;
      var offset = this.actorModel.getFirstKeyframeOffset();

      if (needToAccountForOffset) {
        this.actorModel.prepareForCssStringCreation(offset);
      }

      var cssString = rekapi.renderer.toString(opts);

      if (needToAccountForOffset) {
        this.actorModel.cleanupAfterCssStringCreation(offset);
      }

      this.isGeneratingCss = false;

      return cssString;
    }
  });

  return RekapiComponent;
});
