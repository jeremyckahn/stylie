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
      var fromCoords = this.app.collection.keyframes.first().getAttrs();
      var toCoords = this.app.collection.keyframes.last().getAttrs();
      var points = this.app.util.generatePathPoints(
          fromCoords.left, fromCoords.top, toCoords.left, toCoords.top,
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
