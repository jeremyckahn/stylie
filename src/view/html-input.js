define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/utils'

], function (

  $
  ,_
  ,Backbone

  ,util

) {
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
      return util.trimString(this.$renderTarget.html());
    }

    ,'renderToDOM': function () {
      var renderVal = this.$el.val() || this.initialValue;
      this.$renderTarget.html(renderVal);
    }

  });
});

