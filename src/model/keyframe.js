define(['exports'], function (keyframe) {
  keyframe.model = Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);
      subscribe(this.app.const.KEYFRAME_UPDATED,
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

    ,'updateActor': function () {
      // TODO: This should not have to be in a conditional.  The relationship
      // between the keyframe Models and the Views that render them needs to be
      // rethought.
      if (this.app.canvasView) {
        this.app.canvasView.backgroundView.update();
      }

      var timeToModify = this.get('percent') === 0 ? 0
          : this.app.config.animationDuration;
      if (this.app.config.currentActor) {
        this.app.config.currentActor.modifyKeyframe(timeToModify, this.getCSS());
        this.app.util.redrawKapi(this.app.kapi);
      }
    }

    ,'getCSS': function () {
      return {
        'transform':
          'translateX(' + this.get('x')
          + 'px) translateY(' + this.get('y') + 'px)'
      };
    }

    ,'getAttrs': function () {
      return {
        'x': this.get('x')
        ,'y': this.get('y')
      };
    }

  });
});
