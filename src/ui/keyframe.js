define(['exports', 'src/ui/incrementer-field'],
    function (keyframe, incrementerField) {

  function incrementerGeneratorHelper ($el) {
    return new incrementerField.view({
      'app': this.app

      ,'$el': $el

      ,'onValReenter': _.bind(function (val) {
        this.model.set($el.data('keyframeattr'), val);
        publish(this.app.events.KEYFRAME_UPDATED);
      }, this)
    });
  }

  keyframe.view = Backbone.View.extend({

    'events': {}

    ,'KEYFRAME_TEMPLATE': [
      '<li class="keyframe">'
        ,'<h3></h3>'
        ,'<label>'
          ,'<span>Left:</span>'
          ,'<input class="third-width keyframe-attr-left" type="text" data-keyframeattr="left"></input>'
        ,'</label>'
        ,'<label>'
          ,'<span>Top:</span>'
          ,'<input class="third-width keyframe-attr-top" type="text" data-keyframeattr="top"></input>'
        ,'</label>'
        ,'<hr>'
      ,'</li>'
    ].join('')

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.app = this.owner.app;
      this.$el = $(this.KEYFRAME_TEMPLATE);
      this.initDOMReferences();
      this.initIncrementers();
      this.render();
      subscribe(this.app.events.KEYFRAME_UPDATED, _.bind(this.render, this));
    }

    ,'initDOMReferences': function () {
      this.header = this.$el.find('h3');
      this.inputLeft = this.$el.find('.keyframe-attr-left');
      this.inputTop = this.$el.find('.keyframe-attr-top');
    }

    ,'initIncrementers': function () {
      this.incrementerViews = {};
      _.each([this.inputLeft, this.inputTop], function ($el) {
        this.incrementerViews[$el.data('keyframeattr')] =
            incrementerGeneratorHelper.call(this, $el);
      }, this);
    }

    ,'render': function () {
      this.header.html(this.model.get('percent') + '%');
      this.inputLeft.val(this.model.get('left'));
      this.inputTop.val(this.model.get('top'));
    }

  });
});
