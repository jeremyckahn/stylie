define(['exports'], function (background) {
  background.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.context = this.$el[0].getContext('2d');
      this.$el
        .css({
          'background': '#eee'
          ,'height': opts.height
          ,'width': opts.width
        }).attr({
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

  });
});
