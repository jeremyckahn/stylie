define([

  'underscore'
  ,'backbone'
  ,'shifty'

], function (

  _
  ,Backbone
  ,Tweenable

) {
  return Backbone.Model.extend({

    /**
     * @param {Object} attrs
     * @param {Object} opts
     */
    initialize: function (attrs, opts) {
      this.stylie = opts.stylie;

      if (typeof window.localStorage.savedAnimations === 'undefined') {
        window.localStorage.savedAnimations = JSON.stringify({});
      }

      this.readLocalStorage();
    }

    ,readLocalStorage: function () {
      this.savedAnimations = JSON.parse(window.localStorage.savedAnimations);
    }

    ,writeLocalStorage: function () {
      window.localStorage.savedAnimations =
        JSON.stringify(this.savedAnimations);
    }


    ,load: function (animationName) {
      var savedAnimation = this.savedAnimations[animationName];

      if (!savedAnimation) {
        throw savedAnimation + ' not found';
      }

      this.setCurrentState(savedAnimation);
    }

    ,save: function (animationName) {
      this.savedAnimations[animationName] = this.getCurrentState();
      this.writeLocalStorage();
    }

    ,removeAnimation: function (animationName) {
      delete this.savedAnimations[animationName];
      this.writeLocalStorage();
    }

    ,getAnimationList: function () {
      return _.keys(this.savedAnimations);
    }

    ,getCurrentState: function () {
      return {
        rekapi: this.stylie.rekapi.exportTimeline()
        ,curves: this.getCurrentCurves()
        ,html: this.getCurrentHtml()
        ,metadataVersion: 2
      };
    }

    ,getCurrentCurves: function () {
      var customCurves = [];
      _.each(Tweenable.prototype.formula, function (easingFn, easingName) {
        if (easingName.match(/customEasing\d+/)) {
          customCurves.push({
            name: easingName
            ,x1: easingFn.x1
            ,y1: easingFn.y1
            ,x2: easingFn.x2
            ,y2: easingFn.y2
          });
        }
      });

      return customCurves;
    }

    ,getCurrentHtml: function () {
      return this.stylie.view.htmlInput.$el.val();
    }

    ,setCurrentState: function (state) {
      this.stylie.clearCurrentState();

      this.stylie.view.htmlInput.$el.val(state.html);
      this.stylie.view.htmlInput.renderToDOM();

      _.each(state.curves, function (curve) {
        this.stylie.view.customEase.addEasing(curve.name, curve);
      }, this);

      var currentActorModel = this.stylie.actorCollection.getCurrent();

      // Compatibility check for Rekapi pre-1.0.0
      var actor;
      if (state.kapi) {
        actor = state.kapi.actors[0];
      } else {
        actor = state.rekapi.actors[0];
      }

      // Adjust for animations that were saved before scale support was added.
      actor.propertyTracks.transform.forEach(function (keyframeObject) {
        var hasScale = !!keyframeObject.value.match(/scale/);

        if (!hasScale) {
          keyframeObject.value =
            keyframeObject.value.replace('rotateX', 'scale(1) rotateX');
          var easings = keyframeObject.easing.split(' ');
          easings.splice(1, 0, 'linear');
          keyframeObject.easing = easings.join(' ');
        }
      });

      currentActorModel.importTimeline(actor);
    }

  });
});
