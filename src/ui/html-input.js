define(['src/app'], function (app) {
  return Backbone.View.extend({

    'events': {
      'keyup': 'onKeyup'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$renderTarget = $('#rekapi-canvas .rekapi-actor');
      this.initialValue = this.readFromDOM();
      this.$el.html(this.initialValue);
    }

    ,'onKeyup': function () {
      this.renderToDOM();
    }

    ,'readFromDOM': function () {
      return app.util.trimString(this.$renderTarget.html());
    }

    ,'renderToDOM': function () {
      var renderVal = this.$el.val() || this.initialValue;
      this.$renderTarget.html(renderVal);
    }

  });
});

