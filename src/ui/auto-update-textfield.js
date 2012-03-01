define(function () {

  var autoUpdateTextField = {};

  // Bindable events:
  //   onArrowUp
  //   onArrowDown
  //   onValReenter
  autoUpdateTextField.view = Backbone.View.extend({

    'events': {
      'keyup': 'onKeyup'
      ,'keydown': 'onKeydown'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'onKeyup': function (evt) {
      var val = this.$el.val();
      if (this.options.onValReenter) {
        this.options.onValReenter(val);
      }
    }

    ,'onKeydown': function (evt) {
      var which = evt.which;

      if (which == 38 && this.options.onArrowUp) { // up
        this.options.onArrowUp();
      } else if (which == 40 && this.options.onArrowDown) { // down
        this.options.onArrowDown();
      }
    }

  });

  return autoUpdateTextField;

});
