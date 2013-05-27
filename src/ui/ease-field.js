define(
    ['src/app', 'src/constants', 'src/utils', 'src/ui/auto-update-textfield'],
    function (app, constant, util, AutoUpdateTextFieldView) {

  return AutoUpdateTextFieldView.extend({

    'initialize': function (opts) {
      AutoUpdateTextFieldView.prototype.initialize.apply(this, arguments);
      this.evalEasingFormula(this.$el.val());
      var easename = this.$el.data('easename');
      var fn = Tweenable.prototype.formula[easename];
      var fnString = util.getFormulaFromEasingFunc(fn);
      this.$el.data('lastvalidfn', fnString);
    }

    ,'onValReenter': function (val) {
      try {
        this.evalEasingFormula(val);
        this.$el.data('lastvalidfn', val);
        this.$el.removeClass('error');
        app.view.canvas.backgroundView.update();
        app.kapi.update();
      } catch (ex) {
        this.evalEasingFormula(this.$el.data('lastvalidfn'));
        this.$el.addClass('error');
        publish(constant.ALERT_ERROR,
            ['You input an invalid JavaScript snippet. ' +
            'Please correct the code and try again.']);
      }
    }

    ,'evalEasingFormula': function (formula) {
        eval('Tweenable.prototype.formula.' + this.$el.data('easename')
            + ' = function (x) {return ' + formula + '}');
    }

  });

});
