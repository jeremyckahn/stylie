define(['exports'], function (keyframe) {
  keyframe.model = Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);
      subscribe(this.app.events.KEYFRAME_UPDATED,
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
        this.app.kapi
          .canvas_clear()
          .redraw();
      }
    }

    ,'getCSS': function () {
      return {
        'left': this.get('left') + 'px'
        ,'top': this.get('top') + 'px'
      };
    }

    ,'getAttrs': function () {
      return {
        'left': this.get('left')
        ,'top': this.get('top')
      };
    }

  });
});
