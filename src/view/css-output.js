define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/constants'

], function (

  $
  ,_
  ,Backbone

  ,constant

) {

  var checkboxToVendorMap = {
    moz: 'mozilla'
    ,ms: 'microsoft'
    ,o: 'opera'
    ,webkit: 'webkit'
    ,w3: 'w3'
  };

  function getPrefixList (stylie) {
    var prefixList = [];
    _.each(stylie.config.activeClasses, function (isActive, vendorName) {
      if (isActive) {
        prefixList.push(checkboxToVendorMap[vendorName]);
      }
    });

    return prefixList;
  }

  return Backbone.View.extend({

    events: { }

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {jQuery} $trigger
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;
      this.$trigger = opts.$trigger;
      this.$animationIteration = opts.$animationIteration;
      this.$actorEl = $('#preview-area .rekapi-actor');

      this.$trigger.on('click', _.bind(this.onTriggerClick, this));
      this.listenTo(this.stylie,
          constant.UPDATE_CSS_OUTPUT, _.bind(this.renderCSS, this));
    }

    ,onTriggerClick: function (evt) {
      this.renderCSS();
    }

    ,renderCSS: function () {
      var stylie = this.stylie;
      var cssClassName = stylie.view.cssNameField.$el.val();

      var currentActor = stylie.actorCollection.getCurrent();
      var keyframeCollection = currentActor.keyframeCollection;
      var firstKeyframe = keyframeCollection.first();
      var offsets = this.isOutputOrientedToFirstKeyframe()
          ? { x: -firstKeyframe.get('x'), y: -firstKeyframe.get('y') }
          : { x: 0, y: 0 };
      keyframeCollection.offsetKeyframes(offsets);

      var cssOutput = stylie.rekapi.renderer.toString({
        vendors: getPrefixList(stylie)
        ,name: cssClassName
        ,iterations: this.$animationIteration.val()
        ,isCentered: currentActor.get('isCenteredToPath')
        ,fps: stylie.view.fpsSlider.getFPS()
      });

      // Reverse the offset
      _.each(offsets, function (offsetValue, offsetName) {
        offsets[offsetName] = -offsetValue;
      });
      keyframeCollection.offsetKeyframes(offsets);

      this.$el.val(cssOutput);
    }

    /**
     * @return {boolean}
     */
    ,isOutputOrientedToFirstKeyframe: function () {
      return this.stylie.view.orientation.getOrientation()
        === 'first-keyframe';
    }
  });
});
