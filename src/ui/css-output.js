define(['exports'], function (cssOutput) {

  var checkboxToVendorMap = {
    'moz': 'mozilla'
    ,'ms': 'microsoft'
    ,'o': 'opera'
    ,'webkit': 'webkit'
    ,'w3': 'w3'
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
      var actorIds = this.app.kapi.getActorIds();
      var actor = this.app.kapi.getActor(actorIds[0]);
      var fromTransformProp = actor.getKeyframeProperty('transform', 0);
      var toTransformProp = actor.getKeyframeProperty('transform', 1);
      var originalEasing = toTransformProp.easing;
      var easingChunks = originalEasing.split(' ');
      var wasOptimized = false;

      if (easingChunks[0] === easingChunks[1]) {
        actor.modifyKeyframeProperty('transform', 0, {
          'easing': easingChunks[0]
        });
        actor.modifyKeyframeProperty('transform', 1, {
          'easing': easingChunks[0]
        });
        wasOptimized = true;
      }

      var cssOutput = this.app.kapi.toCSS({
        'vendors': getPrefixList(this.app)
        ,'name': this.app.view.cssNameFieldView.$el.val()
      });
      this.$el.val(cssOutput);

      if (wasOptimized) {
        actor.modifyKeyframeProperty('transform', 0, {
          'easing': originalEasing
        });
        actor.modifyKeyframeProperty('transform', 1, {
          'easing': originalEasing
        });
      }
    }

  });
});
