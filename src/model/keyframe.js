define([

  'underscore'
  ,'backbone'
  ,'minpubsub'

  ,'src/app'
  ,'src/constants'

], function (

  _
  ,Backbone
  ,MinPubSub

  ,app
  ,constant

) {
  return Backbone.Model.extend({

    'initialize': function (attrs, opts) {
      _.extend(this, opts);

      // TODO: This message subscription and event binding should be
      // consolidated into one operation.
      this._boundModifyKeyframeHandler = _.bind(this.modifyKeyframe, this);
      MinPubSub.subscribe(
          constant.ACTOR_ORIGIN_CHANGED, this._boundModifyKeyframeHandler);
      this.on('change', this._boundModifyKeyframeHandler);
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
      MinPubSub.publish(constant.ANIMATION_LENGTH_CHANGED);
    }

    ,'destroy': function () {
      MinPubSub.unsubscribe(
          constant.ACTOR_ORIGIN_CHANGED, this._boundModifyKeyframeHandler);
      this.off('change', this._boundModifyKeyframeHandler);
      this.trigger('destroy');
    }

    ,'setEasingString': function (newEasingString) {
      this.get('easing', newEasingString);
      this.owner.modifyKeyframe(
          this.get('millisecond'), {}, { 'transform': newEasingString });
    }

    ,'getEasingObject': function () {
      var easingChunks = this.get('easing').split(' ');
      return {
        'x': easingChunks[0]
        ,'y': easingChunks[1]
        ,'rX': easingChunks[2]
        ,'rY': easingChunks[3]
        ,'rZ': easingChunks[4]
      };
    }

    ,'getCSS': function () {
      return {
        'transform':
          ['translate(', this.get('x')
            ,'px, ', this.get('y')
            ,'px) rotateX(', this.get('rX')
            ,'deg) rotateY(', this.get('rY')
            ,'deg) rotateZ(', this.get('rZ')
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
        ,'rX': this.get('rX')
        ,'rY': this.get('rY')
        ,'rZ': this.get('rZ')
      };
    }

  });
});
