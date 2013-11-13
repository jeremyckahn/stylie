define(['src/app', 'src/constants'], function (app, constant) {

  return Backbone.View.extend({

    'events': {
      'click button': 'onSaveClick'
      ,'submit': 'onSubmit'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$nameField = this.$el.find('input');
    }

    ,'onSaveClick': function () {
      this.saveAnimation();
    }

    ,'onSubmit': function (evt) {
      evt.preventDefault();
      this.saveAnimation();
    }

    ,'saveAnimation': function () {
      var animationName = this.$nameField.val();
      this.model.save(animationName);
      publish(constant.ANIMATION_SAVED, [animationName]);
    }

    ,'setInputValue': function (value) {
      this.$nameField.val(value);
    }

  });

});
