define(['./auto-update-textfield'], function (autoUpdateTextfield) {

  var easeField = {};

  easeField.view = autoUpdateTextfield.view.extend({

    'initialize': function (opts) {
      autoUpdateTextfield.view.prototype.initialize.apply(this, arguments);
      var easename = this.$el.data('easename');
      var fn = Tweenable.prototype.formula[easename];
      var fnString = this.app.util.getFormulaFromEasingFunc(fn);
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
        this.app.util.updatePath();
      } catch (ex) {
        eval('Tweenable.prototype.formula.' + easename
            + ' = function (x) {return ' + lastValid + '}');
        this.$el.addClass('error');
      }
    }

  });

  return easeField;

});
