define(['exports'], function (background) {
  background.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.context = this.$el[0].getContext('2d');
      this.$el.css('background', '#eee');
      this.resize({
        'height': opts.height
        ,'width': opts.width
      });
    }

    ,'update': function () {
      if (this.app.config.prerenderedPath) {
        this.$el[0].width = this.$el.width();
        if (this.app.config.isPathShowing) {
          this.context.drawImage(this.app.config.prerenderedPath, 0, 0);
        }
      }
    }

    ,'resize': function (dims) {
      _.each(['height', 'width'], function (dim) {
        if (dim in dims) {
          var tweakObj = {};
          tweakObj[dim] = dims[dim];
          this.$el
            .css(tweakObj)
            .attr(tweakObj);
        }
      }, this);
    }

  });
});
