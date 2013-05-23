define(function () {

  return Backbone.View.extend({
    'initialize': function (opts) {
      _.extend(this, opts);

      this.app.view.crosshairs.addCrosshairView(this.model);
      this.app.view.keyframeForms.addKeyframeView(this.model);
    }
  });
});
