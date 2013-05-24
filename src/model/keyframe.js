define(['src/app'], function (app) {
  return Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);
      subscribe(app.constant.KEYFRAME_UPDATED,
          _.bind(this.updateActor, this));
    }

    ,'validate': function (attrs) {
      var foundNaN = false;
      _.each(attrs, function (attr) {
        if (typeof attr !== 'number') {
          foundNaN = true;
        }
      });

      if (foundNaN) {
        return 'Number is NaN';
      }
    }

    ,'updateActor': function (opt_isUpdatePrevented) {
      // TODO: This should not have to be in a conditional.  The relationship
      // between the keyframe Models and the Views that render them needs to be
      // rethought.
      if (app.canvasView) {
        app.canvasView.backgroundView.update();
      }

      var timeToModify = this.get('percent') === 0
          ? 0
          : app.config.animationDuration;

      if (app.config.currentActor) {
        app.config.currentActor.modifyKeyframe(
            timeToModify, this.getCSS());
        if (!opt_isUpdatePrevented) {
          app.kapi.update();
        }
      }
    }

    ,'getCSS': function () {
      return {
        'transform':
          ['translateX(', this.get('x')
            ,'px) translateY(', this.get('y')
            ,'px) rotate(', this.get('r')
            ,app.config.isCenteredToPath
              ? 'deg) translate(-50%, -50%)'
              : 'deg)'
            ].join('')
      };
    }

    ,'getAttrs': function () {
      return {
        'x': this.get('x')
        ,'y': this.get('y')
        ,'r': this.get('r')
      };
    }

  });
});
