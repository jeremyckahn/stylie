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
      var cssOutput = this.app.kapi.toCSS({
        'vendors': getPrefixList(this.app)
        ,'name': this.app.view.cssNameFieldView.$el.val()
        ,'iterations': this.app.config.animationIteration.val()
      });
      this.$el.val(cssOutput);
    }

  });
});
