define(['exports'], function (select) {

  function getNewEasingString (app) {
    var xEasing = app.config.selects.x.$el.val();
    var yEasing = app.config.selects.y.$el.val();
    return xEasing + ' ' + yEasing;
  }

  // TODO: This View is not generic enough.  It should be either be made more
  // generic or renamed to be specific to the easing selection functionality.
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
      this.app.config.currentActor.modifyKeyframe(
          this.app.config.animationDuration, {},
          { 'transform': getNewEasingString(this.app) })
      this.app.canvasView.backgroundView.update();
      this.app.kapi.update();
    }

  });

});
