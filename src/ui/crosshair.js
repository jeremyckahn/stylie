define(['exports', 'src/model/keyframe'], function (crosshair, keyframe) {

  crosshair.view = Backbone.View.extend({

    'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el.dragon({
        'within': this.$el.parent()
        ,'drag': _.bind(this.drag, this)
        ,'dragEnd': _.bind(this.dragEnd, this)
      });

      this.model.set('percent', +this.$el.data('percent'));
      this.model.crosshairView = this;
      this.updateModel();
    }

    ,'drag': function (evt, ui) {
      this.updateModel();
    }

    ,'dragEnd': function (evt, ui) {
      this.drag.apply(this, arguments);
      this.app.view.cssOutputView.renderCSS();
      publish(this.app.const.UPDATE_CSS_OUTPUT);
    }

    ,'render': function () {
      this.$el.css({
        'left': this.model.get('x') + 'px'
        ,'top': this.model.get('y') + 'px'
      });
    }

    ,'updateModel': function () {
      var pxTo = this.app.util.pxToNumber;
      this.model.set({
        'x': pxTo(this.$el.css('left'))
        ,'y': pxTo(this.$el.css('top'))
      });
      publish(this.app.const.KEYFRAME_UPDATED);
      this.app.collection.keyframes.updateModelKeyframeViews();

      // Remove this null check once Kapi initialization is refactored out of
      // the canvas View.
      if (this.app.kapi) {
        this.app.util.redrawKapi(this.app.kapi);
      }
    }

  });
});
