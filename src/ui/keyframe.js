define(['src/app'], function (app) {

  return Backbone.View.extend({
    'initialize': function (opts) {
      _.extend(this, opts);

      app.view.crosshairs.addCrosshairView(this.model);
      app.view.keyframeForms.addKeyframeView(this.model);
    }
  });
});
