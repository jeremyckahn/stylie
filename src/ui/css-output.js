define(['src/app'], function (app) {

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

  return Backbone.View.extend({

    'events': { }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$trigger.on('click', _.bind(this.onTriggerClick, this));
    }

    ,'onTriggerClick': function (evt) {
      this.renderCSS();
    }

    ,'renderCSS': function () {
      var cssOutput = app.kapi.toCSS({
        'vendors': getPrefixList(app)
        ,'name': app.view.cssNameField.$el.val()
        ,'iterations': app.$el.animationIteration.val()
        ,'isCentered': app.config.isCenteredToPath
      });
      this.$el.val(cssOutput);
    }

  });
});
