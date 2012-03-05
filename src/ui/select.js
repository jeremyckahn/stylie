define(function () {
  var select = {};

  select.view = Backbone.View.extend({

    'events': {
      'change': 'onChange'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      _.each(Tweenable.prototype.formula, function (formula, name) {
        var option = $(document.createElement('option'), {
            'value': name
          });

        option.html(name);
        this.$el.append(option);
      }, this);
    }

    ,'onChange': function (evt) {
      var easingObj = {};
      easingObj[this.$el.data('axis')] = this.$el.val();
      this.app.config.currentActor.modifyKeyframe(
          this.app.config.animationDuration, {}, easingObj)
      this.app.util.updatePath();
      this.app.kapi
        .canvas_clear()
        .redraw();
    }

  });

  return select;

});
