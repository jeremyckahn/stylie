define(['src/app', 'src/constants'], function (app, constant) {

  return Backbone.View.extend({

    'events': {
      'click .icon-remove': 'onRemoveClick'
      ,'click #animation-load': 'loadAnimation'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$animationSelect = this.$el.find('select');
      this.refreshAnimationList();

      subscribe(constant.ANIMATION_SAVED,
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
        publish(constant.ALERT_ERROR, ['Please specify an animation to load.']);
        return;
      }

      this.model.load(val);
      app.view.saveView.setInputValue(val);
    }

  });

});
