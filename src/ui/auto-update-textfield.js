define(function () {

  // Bindable event handlers:
  //   onArrowUp()
  //   onArrowDown()
  //   onValReenter(val)
  return Backbone.View.extend({

    'events': {
      'keyup': 'onKeyup'
      ,'keydown': 'onKeydown'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'onKeyup': function (evt) {
      var val = this.$el.val();
      if (this.onValReenter) {
        this.onValReenter(val);
      }
    }

    ,'onKeydown': function (evt) {
      var which = evt.which;

      if (+which === 38 && this.onArrowUp) { // up
        this.onArrowUp();
      } else if (+which === 40 && this.onArrowDown) { // down
        this.onArrowDown();
      }
    }

  });

});
