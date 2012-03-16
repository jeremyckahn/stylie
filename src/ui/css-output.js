define(['exports', 'src/css-gen'], function (cssOutput, cssGen) {

  var checkboxToVendorMap = {
    'moz': '-moz'
    ,'webkit': '-webkit'
    ,'w3': ''
  };

  function getPrefixList (app) {
    var prefixList = [];
    _.each(app.config.activeClasses, function (isActive, vendorName) {
      if (isActive) {
        prefixList.push(checkboxToVendorMap[vendorName]);
      }
    });

    return prefixList;
  }

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
      var duration = this.app.view.durationFieldView.$el.val();
      var cssOutput = cssGen.generateCSS3ClassAndKeyframes(
          this.app.view.cssNameFieldView.$el.val(), points, duration,
          getPrefixList(this.app));
      this.$el.val(cssOutput);
    }

  });
});
