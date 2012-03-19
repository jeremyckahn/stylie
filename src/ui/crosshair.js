define(['exports', 'src/model/keyframe'], function (crosshair, keyframe) {

  crosshair.view = Backbone.View.extend({

    // $.fn.draggable events don't propagate, so event delegation doesn't work.
    // Drag event handlers must be bound in `initialize`.
    'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el.draggable({
        'containment': 'parent'
        ,'drag': _.bind(this.onDrag, this)
        ,'stop': _.bind(this.onDragStop, this)
      });

      this.model.set('percent', +this.$el.data('percent'));
      this.model.crosshairView = this;
      this.updateModel();
      subscribe(this.app.events.KEYFRAME_UPDATED, _.bind(this.render, this));
    }

    ,'onDrag': function (evt, ui) {
      this.updateModel();
    }

    ,'onDragStop': function (evt, ui) {
      this.onDrag.apply(this, arguments);
      this.app.view.cssOutputView.renderCSS();
    }

    ,'render': function () {
      this.$el.css({
        'left': this.model.get('left') + 'px'
        ,'top': this.model.get('top') + 'px'
      });

      // TODO: This should not have to be in a conditional.  The relationship
      // between the keyframe Models and the Views that render them needs to be
      // rethought.
      if (this.app.canvasView) {
        this.app.util.updatePath();
        this.app.canvasView.backgroundView.update();
      }
    }

    ,'updateModel': function () {
      this.model.set({
        'left': this.app.util.pxToNumber(this.$el.css('left'))
        ,'top': this.app.util.pxToNumber(this.$el.css('top'))
      });
      publish(this.app.events.KEYFRAME_UPDATED);
    }

  });
});
