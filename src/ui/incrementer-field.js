define(['src/ui/auto-update-textfield'],
    function (AutoUpdateTextFieldView) {

  var FLOATING_POINT_PRECISION = 6;

  return AutoUpdateTextFieldView.extend({

    'increment': 10

    ,'initialize': function (opts) {
      AutoUpdateTextFieldView.prototype.initialize.call(this, opts);
    }

    ,'tweakVal': function (tweakAmount) {
      // Have to do weird number munging here to prevent IEEE 754 floating
      // point issues:
      // http://stackoverflow.com/questions/8503157/ieee-754-floating-point-arithmetic-rounding-error-in-c-sharp-and-javascript
      var parsedNumber = parseFloat(this.$el.val());
      var precisionRestrictedNumber = +(
          parsedNumber + tweakAmount).toPrecision(FLOATING_POINT_PRECISION);
      this.$el.val(precisionRestrictedNumber);
      this.$el.trigger('keyup');
    }

    ,'onArrowUp': function () {
      this.tweakVal(this.increment);
    }

    ,'onArrowDown': function () {
      this.tweakVal(-this.increment);
    }

    ,'tearDown': function () {
      AutoUpdateTextFieldView.prototype.tearDown.call(this);
    }

  });

});
