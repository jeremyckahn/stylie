define(['src/app', 'src/constants'], function (app, constant) {

  return Backbone.View.extend({

    'GRANULARITY_RANGE':
        constant.MAXIMUM_CSS_OUTPUT_GRANULARITY
            - constant.MINIMUM_CSS_OUTPUT_GRANULARITY

    ,'initialize': function (opts) {
      _.extend(this, opts);

      this.$el.dragonSlider({
        'drag': _.bind(this.onSliderDrag, this)
      });

      // Theoretically the "- 1" shouldn't be necessary, but having it prevents
      // tiny rounding issues in the initial granularity setting.  Removing it
      // won't break anything, but it's a nicer user experience when the
      // default @keyframe percentages are even numbers.
      var val = (constant.DEFAULT_CSS_OUTPUT_GRANULARITY
              - constant.MINIMUM_CSS_OUTPUT_GRANULARITY)
                  / (this.GRANULARITY_RANGE - 1);

      this.$el.dragonSliderSet(val, false);
    }

    ,'onSliderDrag': function (val) {
      app.view.cssOutput.renderCSS();
    }

    ,'getGranularity': function () {
      var sliderVal = this.$el.dragonSliderGet();
      return constant.MINIMUM_CSS_OUTPUT_GRANULARITY
             + (sliderVal * this.GRANULARITY_RANGE);
    }
  });

});
