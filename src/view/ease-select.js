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

    'events': {
      'change': 'onChange'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      _.each(Tweenable.prototype.formula, function (formula, name) {
        var option = $(document.createElement('option'), {
            'value': name
          });

        option.html(name);
        this.$el.append(option);
      }, this);

      this.$el.val(this.owner.model.getEasingObject()[this.$el.data().axis]);
    }

    ,'onChange': function (evt) {
      this.owner.updateEasingString();
    }

    ,'tearDown': function () {
      this.remove();
      _.empty(this);
    }

  });

});
