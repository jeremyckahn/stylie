define(['exports'], function (keyframe) {
  keyframe.view = Backbone.View.extend({

    'events': {}

    ,'KEYFRAME_TEMPLATE': [
      '<li class="keyframe">'
        ,'<h3></h3>'
        ,'<label>'
          ,'<span>Left:</span>'
          ,'<input class="third-width keyframe-attr-left" type="text"></input>'
        ,'</label>'
        ,'<label>'
          ,'<span>Top:</span>'
          ,'<input class="third-width keyframe-attr-top" type="text"></input>'
        ,'</label>'
        ,'<hr>'
      ,'</li>'
    ].join('')

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el = $(this.KEYFRAME_TEMPLATE);
      this.initDOMReferences();
      this.render();
    }

    ,'initDOMReferences': function () {
      this.header = this.$el.find('h3');
      this.inputLeft = this.$el.find('.keyframe-attr-left');
      this.inputTop = this.$el.find('.keyframe-attr-top');
    }

    ,'render': function () {
      this.header.html(this.model.cid);
      this.inputLeft.val(this.model.get('left'));
      this.inputTop.val(this.model.get('top'));
    }

  });
});
