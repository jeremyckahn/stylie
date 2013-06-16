define(['src/app'], function (app) {

  function getNewEasingString (app) {
    var xEasing = app.view.selectX.$el.val();
    var yEasing = app.view.selectY.$el.val();
    var rEasing = app.view.selectR.$el.val();
    return [xEasing, yEasing, rEasing].join(' ');
  }

  // TODO: This View is not generic enough.  It should be either be made more
  // generic or renamed to be specific to the easing selection functionality.
  return Backbone.View.extend({

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
      app.collection.actors.getCurrent().modifyKeyframe(
          app.kapi.animationLength(), {},
          { 'transform': getNewEasingString(app) });
      app.view.canvas.backgroundView.update();
      app.kapi.update();
    }

  });

});
