define([

  'underscore'
  ,'backbone'

  ,'src/constants'

], function (

  _
  ,Backbone

  ,constant

) {

  return Backbone.View.extend({

    events: {
      'click button': 'onSaveClick'
      ,submit: 'onSubmit'
    }

    /**
     * @param {Stylie} stylie
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;
      this.$nameField = this.$el.find('input');
    }

    ,onSaveClick: function () {
      this.saveAnimation();
    }

    ,onSubmit: function (evt) {
      evt.preventDefault();
      this.saveAnimation();
    }

    ,saveAnimation: function () {
      var animationName = this.$nameField.val();
      this.model.save(animationName);
      this.stylie.trigger(constant.ANIMATION_SAVED, animationName);
    }

    ,setInputValue: function (value) {
      this.$nameField.val(value);
    }

  });

});
