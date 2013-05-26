define(['src/app', 'src/utils', 'src/ui/auto-update-textfield'],
    function (app, util, AutoUpdateTextFieldView) {

  return AutoUpdateTextFieldView.extend({

    'initialize': function (opts) {
      AutoUpdateTextFieldView.prototype.initialize.apply(this, arguments);
      var easename = this.$el.data('easename');
      var fn = Tweenable.prototype.formula[easename];
      var fnString = util.getFormulaFromEasingFunc(fn);
      this.$el.val(fnString);
      this.$el.data('lastvalidfn', fnString);
    }

    ,'onValReenter': function (val) {
      var easename = this.$el.data('easename');
      var lastValid = this.$el.data('lastvalidfn');

      if (lastValid === val) {
        return;
      }

      try {
        eval('Tweenable.prototype.formula.' + easename
            + ' = function (x) {return ' + val + '}');
        this.$el.data('lastvalidfn', val);
        this.$el.removeClass('error');
        app.view.canvas.backgroundView.update();
        app.kapi.update();
      } catch (ex) {
        eval('Tweenable.prototype.formula.' + easename
            + ' = function (x) {return ' + lastValid + '}');
        this.$el.addClass('error');
      }
    }

  });

});
