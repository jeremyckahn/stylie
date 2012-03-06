define(function () {

  var crosshair = {};

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
    }

    ,'onDrag': function (evt, ui) {
      var pos = this.$el.data('pos');
      var timeToModify = pos === 'from' ? 0 : this.app.config.animationDuration;
      this.app.config.currentActor.modifyKeyframe(
          timeToModify, this.getCenter());
      this.app.kapi
        .canvas_clear()
        .redraw();
      this.app.util.updatePath();
      this.app.canvasView.updateDOMBackground();
    }

    ,'onDragStop': function (evt, ui) {
      this.onDrag.apply(this, arguments);
    }

    ,'getCenter': function () {
      var pos = this.$el.position();
      return {
        'left': (pos.left + this.$el.width()/2) + 'px'
        ,'top': (pos.top + this.$el.height()/2) + 'px'
      };

    }

  });

  return crosshair;

});
