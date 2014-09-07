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
  'use strict';

  var ManagementConsoleView = Backbone.View.extend({
    events: {
      'click .save-controls button': 'onClickSaveButton'
      ,'submit .save-controls': 'onSubmitSave'
      ,'click .load-controls .icon-remove': 'onRemoveIconClick'
      ,'click .animation-load': 'onClickAnimationLoad'
      ,'click .create-new-animation': 'onClickCreateNewAnimation'
    }

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {AnimationModel} model
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;
      this.initDOM();
      this.refreshAnimationList();

      this.listenTo(this.stylie,
          constant.ANIMATION_SAVED, _.bind(this.refreshAnimationList, this));
    }

    ,initDOM: function () {
      this.$animationNameInput = this.$el.find('#animation-name');
      this.$animationSelect = this.$el.find('.load-controls select');
    }

    ,onClickSaveButton: function () {
      this.saveAnimation();
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onSubmitSave: function (evt) {
      evt.preventDefault();
      this.saveAnimation();
    }

    ,onRemoveIconClick: function () {
      this.removeAnimation(this.$animationSelect.val());
    }

    ,onClickAnimationLoad: function () {
      this.loadAnimation();
    }

    ,onClickCreateNewAnimation: function () {
      this.createNewAnimation();
    }

    /**
     * @param {string} animationName
     */
    ,removeAnimation: function (animationName) {
      this.model.removeAnimation(animationName);
      this.refreshAnimationList();
    }

    ,saveAnimation: function () {
      var animationName = this.$animationNameInput.val();
      this.model.save(animationName);
      this.stylie.trigger(constant.ANIMATION_SAVED, animationName);
    }

    ,loadAnimation: function () {
      var val = this.$animationSelect.val();

      if (!val) {
        this.stylie.trigger(
            constant.ALERT_ERROR, 'Please specify an animation to load.');
        return;
      }

      this.model.load(val);
      this.$animationNameInput.val(val);
    }

    /**
     * @param {string} opt_currentAnimation
     */
    ,refreshAnimationList: function (opt_currentAnimation) {
      this.$animationSelect.children().remove();
      _.each(this.model.getAnimationList(), function (animationName) {
        var $option = $(document.createElement('option'));
        $option
          .val(animationName)
          .html(animationName);
        this.$animationSelect.append($option);
      }, this);

      this.$animationSelect.val(opt_currentAnimation);
    }

    ,createNewAnimation: function () {
      this.stylie.clearCurrentState();
      this.stylie.createDefaultState();
    }
  });

  return ManagementConsoleView;
});
