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

    ,lateralusEvents: {
      bezierCurveUpdated: function () {
        this.onRekapiTimelineModified();
      }

      ,userRequestPlay: function () {
        this.rekapi.play();
      }

      ,userRequestPause: function () {
        this.rekapi.pause();
      }

      ,userRequestStop: function () {
        this.rekapi.stop();
        this.rekapi.update(0);
      }
    }

    ,initialize: function () {
      this.rekapi = new Rekapi(document.body);
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
      var rekapi = this.rekapi;
      var needToAccountForOffset =
        this.lateralus.model.get('cssOrientation') === 'first-keyframe';

      var offset = this.actorModel.getFirstKeyframeOffset();

      if (needToAccountForOffset) {
        this.actorModel.prepareForCssStringCreation(offset);
      }

      var cssString = rekapi.renderer.toString(opts);

      if (needToAccountForOffset) {
        this.actorModel.cleanupAfterCssStringCreation(offset);
      }

      return cssString;
    }
  });

  return RekapiComponent;
});
