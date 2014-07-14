define([

  'underscore'
  ,'backbone'

  ,'src/constants'

], function (

  _
  ,Backbone

  ,constant

) {
  return Backbone.Model.extend({

    /**
     * @param {Object} attrs
     * @param {ActorModel} owner
     */
    'initialize': function (attrs, opts) {
      this.stylie = this.collection.stylie;
      this.owner = opts.owner;

      // TODO: This message subscription and event binding should be
      // consolidated into one operation.
      this._boundModifyKeyframeHandler = _.bind(this.modifyKeyframe, this);
      Backbone.on(
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

    ,'modifyKeyframe': function (opt_preventRekapiUpdate) {
      this.stylie.collection.actors.getCurrent().modifyKeyframe(
          this.get('millisecond'), this.getCSS());

      if (!opt_preventRekapiUpdate) {
        this.stylie.rekapi.update();
      }
    }

    ,'moveKeyframe': function (to) {
      this.stylie.collection.actors.getCurrent().moveKeyframe(
          this.get('millisecond'), to);

      this.set('millisecond', to);

      // TODO: Maybe check to see if this is the last keyframe in the
      // collection before publishing?
      Backbone.trigger(constant.ANIMATION_LENGTH_CHANGED);
    }

    ,'destroy': function () {
      Backbone.off(
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
            ,this.stylie.config.isCenteredToPath
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
