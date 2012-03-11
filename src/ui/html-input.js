define(['exports'], function (htmlInput) {
  htmlInput.view = Backbone.View.extend({

    'events': {
      'keyup': 'onKeyup'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$renderTarget = $('#rekapi-canvas .rekapi-actor');
      this.initialValue = this.readFromDOM();
    }

    ,'onKeyup': function () {
      this.renderToDOM();
    }

    ,'readFromDOM': function () {
      return this.$el.html(
        this.app.util.trimString(this.$renderTarget.html()));
    }

    ,'renderToDOM': function () {
      var renderVal = this.$el.val() || this.initialValue;
      this.$renderTarget.html(renderVal);
    }

  });
});

