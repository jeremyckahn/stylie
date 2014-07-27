define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'shifty'

], function (

  $
  ,_
  ,Backbone
  ,Tweenable

  ) {
  return Backbone.View.extend({

    events: {
      change: 'onChange'
    }

    ,initialize: function () {
      _.each(Tweenable.prototype.formula, function (formula, name) {
        var option = $(document.createElement('option'), {
            value: name
          });

        option.html(name);
        this.$el.append(option);
      }, this);

      this.$el.val(this.model.getEasingObject()[this.$el.data().axis]);
    }

    ,onChange: function (evt) {
      // The change event on the DOM isn't recognized by Backbone, so
      // daisy-chain a Backbone.Events event here.
      this.trigger('change');
    }

    ,teardown: function () {
      this.remove();
      _.empty(this);
    }

  });

});
