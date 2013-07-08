define(['src/app', 'src/constants', 'src/ui/keyframe-form'],
    function (app, constant, KeyframeFormView) {

  return Backbone.View.extend({

    'events': {
      'click .add button': 'createKeyframe'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.keyframeForms = {};
    }

    ,'render': function () {
      _.each(this.keyframeForms, function (view) {
        view.render();
      });
    }

    ,'addKeyframeView': function (model) {
      var keyframeFormView = new KeyframeFormView({
        'owner': this
        ,'model': model
      });

      this.$formsList = this.$el.find('ul.controls');
      this.keyframeForms[keyframeFormView.cid] = keyframeFormView;
      this.$formsList.append(keyframeFormView.$el);
    }

    ,'createKeyframe': function (evt) {
      this.model.appendNewKeyframeWithDefaultProperties();
    }

    ,'reorderKeyframeFormViews': function () {
      this.$formsList.children().detach();
      var keyframeFormViews = this.model.getKeyframeFormViews();
      _.each(keyframeFormViews, function (keyframeFormView) {
        this.$formsList.append(keyframeFormView.$el);
      }, this);
    }

  });
});
