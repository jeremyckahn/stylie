define(['exports', 'src/css-gen'], function (cssOutput, cssGen) {
  cssOutput.view = Backbone.View.extend({

    'events': { }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$trigger.on('click', _.bind(this.onTriggerClick, this));
    }

    ,'onTriggerClick': function (evt) {
      this.renderCSS();
    }

    ,'renderCSS': function () {
      var fromCoords = this.app.config.crosshairs.from.getCenter();
      var toCoords = this.app.config.crosshairs.to.getCenter();
      var points = this.app.util.generatePathPoints(
          this.app.util.pxToNumber(fromCoords.left),
          this.app.util.pxToNumber(fromCoords.top),
          this.app.util.pxToNumber(toCoords.left),
          this.app.util.pxToNumber(toCoords.top),
          this.app.config.selects.x.$el.val(),
          this.app.config.selects.y.$el.val());
      var duration = this.app.view.durationField.$el.val();
      //var cssOutput = cssGen.generateCSS3Keyframes('foo', points,'-webkit-');
      var cssOutput = cssGen.generateCSS3ClassAndKeyframes(
          'foo', points, duration, ['-webkit']);
      this.$el.val(cssOutput);
    }

  });
});
