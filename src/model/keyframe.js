define([

  'underscore'
  ,'backbone'

  ,'src/constants'

], function (

  _
  ,Backbone

  ,constant

) {
  var KeyframeModel = Backbone.Model.extend({

    /**
     * @param {Object} attrs
     * @param {ActorModel} actorModel
     */
    initialize: function (attrs, opts) {
      this.stylie = this.collection.stylie;
      this.actorModel = opts.actorModel;

      // TODO: This message subscription and event binding should be
      // consolidated into one operation.
      var updateRawKeyframe = _.bind(this.updateRawKeyframe, this);
      this.listenTo(
        this.actorModel, 'change:isCenteredToPath', updateRawKeyframe);
      this.on('change', updateRawKeyframe);
    }

    ,validate: function (attrs) {
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

    ,updateRawKeyframe: function () {
      this.actorModel.get('actor').modifyKeyframe(
          this.attributes.millisecond, this.getCSS(),
          { transform: this.attributes.easing });
    }

    /**
     * @param {number} toMillisecond
     */
    ,moveTo: function (toMillisecond) {
      this.actorModel.moveKeyframe(this.attributes.millisecond, toMillisecond);
    }

    ,destroy: function () {
      this.trigger('destroy');
      this.stopListening();
      this.off();
    }

    ,getEasingObject: function () {
      var easingChunks = this.get('easing').split(' ');
      return {
        x: easingChunks[0]
        ,y: easingChunks[1]
        ,scale: easingChunks[2]
        ,rX: easingChunks[3]
        ,rY: easingChunks[4]
        ,rZ: easingChunks[5]
      };
    }

    ,getCSS: function () {
      var attributes = this.attributes;

      return KeyframeModel.createCSSRuleObject(
          attributes.x
          ,attributes.y
          ,attributes.scale
          ,attributes.rX
          ,attributes.rY
          ,attributes.rZ
          ,this.actorModel.get('isCenteredToPath'));
    }

    ,getAttrs: function () {
      return {
        x: this.get('x')
        ,y: this.get('y')
        ,scale: this.get('scale')
        ,rX: this.get('rX')
        ,rY: this.get('rY')
        ,rZ: this.get('rZ')
      };
    }

    /**
     * @return {{x: number, y: number, rX: number, rY: number, rZ: number}}
     */
    ,getEasings: function () {
      var easingChunks = this.attributes.easing.split(' ');

      return {
        x: easingChunks[0]
        ,y: easingChunks[1]
        ,scale: easingChunks[2]
        ,rX: easingChunks[3]
        ,rY: easingChunks[4]
        ,rZ: easingChunks[5]
      };
    }
  }, {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @param {number} rX
     * @param {number} rY
     * @param {number} rZ
     * @param {boolean} isCentered
     */
    createCSSRuleObject: function (x, y, scale, rX, rY, rZ, isCentered) {
      return {
        transform:
          [
            'translate(', x ,'px, ', y
            ,'px) scale(', scale, ')'
            ,' rotateX(', rX
            ,'deg) rotateY(', rY
            ,'deg) rotateZ(', rZ
            ,isCentered
              ? 'deg) translate(-50%, -50%)'
              : 'deg)'
            ].join('')
      };
    }
  });

  return KeyframeModel;
});
