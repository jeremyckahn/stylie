define(['src/ui/auto-update-textfield'],
    function (AutoUpdateTextFieldView) {

  return AutoUpdateTextFieldView.extend({

    'increment': 10

    ,'initialize': function (opts) {
      AutoUpdateTextFieldView.prototype.initialize.call(this, opts);
    }

    ,'tweakVal': function (tweakAmount) {
      this.$el.val(parseInt(this.$el.val(), 10) + tweakAmount);
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
