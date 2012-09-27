define(['exports', 'src/model/keyframe'], function (crosshair, keyframe) {

  crosshair.view = Backbone.View.extend({

    'events': {}

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el.dragon({
        'within': this.$el.parent()
        ,'dragStart': _.bind(this.dragStart, this)
        ,'dragEnd': _.bind(this.dragEnd, this)
      });

      this.model.set('percent', +this.$el.data('percent'));
      this.model.crosshairView = this;
      this.updateModel();
    }

    ,'dragStart': function (evt, ui) {
      this.dimPathLine();
    }

    ,'dragEnd': function (evt, ui) {
      this.updateModel();
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
      this.app.kapi.update();
    }

    ,'dimPathLine': function () {
      this.app.canvasView.backgroundView.update(true);
    }

  });
});
