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

  return Backbone.View.extend({

    'events': {
      'click .icon-remove': 'onRemoveClick'
      ,'click #animation-load': 'loadAnimation'
    }

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {AnimationModel} model
     *   @param {Element} el
     */
    ,'initialize': function (opts) {
      this.stylie = opts.stylie;
      this.$animationSelect = this.$el.find('select');
      this.refreshAnimationList();

      Backbone.on(constant.ANIMATION_SAVED,
        _.bind(this.refreshAnimationList, this));
    }

    ,'refreshAnimationList': function (currentAnimation) {
      this.$animationSelect.children().remove();
      _.each(this.model.getAnimationList(), function (animationName) {
        var $option = $(document.createElement('option'));
        $option
          .val(animationName)
          .html(animationName);
        this.$animationSelect.append($option);
      }, this);

      this.$animationSelect.val(currentAnimation);
    }

    ,'onRemoveClick': function () {
      this.removeAnimation(this.$animationSelect.val());
    }

    ,'removeAnimation': function (animationName) {
      this.model.removeAnimation(animationName);
      this.refreshAnimationList();
    }

    ,'loadAnimation': function () {
      var val = this.$animationSelect.val();

      if (!val) {
        Backbone.trigger(
            constant.ALERT_ERROR, 'Please specify an animation to load.');
        return;
      }

      this.model.load(val);
      this.stylie.view.saveView.setInputValue(val);
    }

  });

});
