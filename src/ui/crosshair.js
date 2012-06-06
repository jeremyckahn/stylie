define(['exports', 'src/model/keyframe'], function (crosshair, keyframe) {

  crosshair.view = Backbone.View.extend({

    'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el.dragon({
        'within': this.$el.parent()
        ,'drag': _.bind(this.drag, this)
        ,'dragStop': _.bind(this.dragStop, this)
      });

      this.model.set('percent', +this.$el.data('percent'));
      this.model.crosshairView = this;
      this.updateModel();
    }

    ,'drag': function (evt, ui) {
      this.updateModel();
    }

    ,'dragStop': function (evt, ui) {
      this.onDrag.apply(this, arguments);
      this.app.view.cssOutputView.renderCSS();
    }

    ,'render': function () {
      this.$el.css({
        'left': this.model.get('left') + 'px'
        ,'top': this.model.get('top') + 'px'
      });
    }

    ,'updateModel': function () {
      var pxTo = this.app.util.pxToNumber;
      this.model.set({
        'left': pxTo(this.$el.css('left'))
        ,'top': pxTo(this.$el.css('top'))
      });
      publish(this.app.events.KEYFRAME_UPDATED);
      this.app.collection.keyframes.updateModelKeyframeViews();
    }

  });
});
