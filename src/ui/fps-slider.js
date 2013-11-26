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

  return Backbone.View.extend({

    'FPS_RANGE':
        constant.MAXIMUM_CSS_OUTPUT_FPS - constant.MINIMUM_CSS_OUTPUT_FPS

    ,'initialize': function (opts) {
      _.extend(this, opts);

      this.$el.dragonSlider({
        'drag': _.bind(this.onSliderDrag, this)
      });

      var val =
          (constant.DEFAULT_CSS_OUTPUT_FPS - constant.MINIMUM_CSS_OUTPUT_FPS)
              / (this.FPS_RANGE - 1);

      this.$el.dragonSliderSet(val, false);
    }

    ,'onSliderDrag': function (val) {
      MinPubSub.publish(constant.UPDATE_CSS_OUTPUT);
    }

    ,'getFPS': function () {
      var sliderVal = this.$el.dragonSliderGet();
      return constant.MINIMUM_CSS_OUTPUT_FPS
             + (sliderVal * this.FPS_RANGE);
    }
  });

});
