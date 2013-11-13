define(['src/app'], function (app) {
  return Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);

      if (typeof window.localStorage.savedAnimations === 'undefined') {
        window.localStorage.savedAnimations = JSON.stringify({});
      }

      this.readLocalStorage();
    }


    ,'readLocalStorage': function () {
      this.savedAnimations = JSON.parse(window.localStorage.savedAnimations);
    }


    ,'writeLocalStorage': function () {
      window.localStorage.savedAnimations =
        JSON.stringify(this.savedAnimations);
    }


    ,'load': function (animationName) {
      var savedAnimation = this.savedAnimations[animationName];

      if (!savedAnimation) {
        throw savedAnimation + ' not found';
      }

      this.setCurrentState(savedAnimation);
    }


    ,'save': function (animationName) {
      this.savedAnimations[animationName] = this.getCurrentState();
      this.writeLocalStorage();
    }


    ,'removeAnimation': function (animationName) {
      delete this.savedAnimations[animationName];
      this.writeLocalStorage();
    }


    ,'getAnimationList': function () {
      return _.keys(this.savedAnimations);
    }


    ,'getCurrentState': function () {
      return {
        'kapi': app.kapi.exportTimeline()
        ,'curves': this.getCurrentCurves()
        ,'html': this.getCurrentHtml()
        ,'metadataVersion': 1
      };
    }


    ,'getCurrentCurves': function () {
      var customCurves = [];
      _.each(Tweenable.prototype.formula, function (easingFn, easingName) {
        if (easingName.match(/customEasing\d+/)) {
          customCurves.push({
            'name': easingName
            ,'x1': easingFn.x1
            ,'y1': easingFn.y1
            ,'x2': easingFn.x2
            ,'y2': easingFn.y2
          });
        }
      });

      return customCurves;
    }


    ,'getCurrentHtml': function () {
      return app.view.htmlInput.$el.val();
    }


    ,'setCurrentState': function (state) {
      app.collection.actors.getCurrent().removeAllKeyframes();
      app.view.customEaseView.removeAllEasings();

      app.view.htmlInput.$el.html(state.html);
      app.view.htmlInput.renderToDOM();

      _.each(state.curves, function (curve) {
        app.view.customEaseView.addEasing(curve.name, curve);
      });

      var currentActorModel = app.collection.actors.getCurrent();
      currentActorModel.importTimeline(state.kapi.actors[0]);
    }

  });
});
