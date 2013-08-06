define(['src/app', 'src/constants'], function (app, constant) {
  return Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);

      // TODO: This message subscription and event binding should be
      // consolidated into one operation.
      subscribe(constant.ACTOR_ORIGIN_CHANGED,
          _.bind(this.modifyKeyframe, this));
      this.on('change', _.bind(this.modifyKeyframe, this));
    }

    ,'validate': function (attrs) {
      var foundNaN = false;
      _.each(attrs, function (attr) {
        if (typeof attr !== 'number') {
          foundNaN = true;
        }
      });

      if (foundNaN) {
        return 'Number is NaN';
      }
    }

    ,'modifyKeyframe': function (opt_preventKapiUpdate) {
      app.collection.actors.getCurrent().modifyKeyframe(
          this.get('millisecond'), this.getCSS());

      if (!opt_preventKapiUpdate) {
        app.kapi.update();
      }
    }

    ,'moveKeyframe': function (to) {
      app.collection.actors.getCurrent().moveKeyframe(
          this.get('millisecond'), to);

      this.set('millisecond', to);

      // TODO: Maybe check to see if this is the last keyframe in the
      // collection before publishing?
      publish(constant.ANIMATION_LENGTH_CHANGED);
    }

    ,'removeKeyframe': function () {
      this.keyframeFormView.tearDown();
      delete this.keyframeFormView;

      this.crosshairView.tearDown();
      delete this.crosshairView;

      this.owner.removeKeyframe(this.get('millisecond'));
    }

    ,'setEasingString': function (newEasingString) {
      this.owner.modifyKeyframe(
          this.get('millisecond'), {}, { 'transform': newEasingString });
    }

    ,'getCSS': function () {
      return {
        'transform':
          ['translate(', this.get('x')
            ,'px, ', this.get('y')
            ,'px) rotate(', this.get('r')
            ,app.config.isCenteredToPath
              ? 'deg) translate(-50%, -50%)'
              : 'deg)'
            ].join('')
      };
    }

    ,'getAttrs': function () {
      return {
        'x': this.get('x')
        ,'y': this.get('y')
        ,'r': this.get('r')
      };
    }

  });
});
