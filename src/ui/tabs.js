define(['exports'], function (tabs) {
  tabs.view = Backbone.View.extend({
    'events': {
      'click .tabs li': 'onTabClick'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.delegateEvents();
      this.tabs = this.$el.find('.tabs').children();
      this.contents = this.$el.find('.tabs-contents').children();
      this.tabs.eq(0).trigger('click');
    }

    ,'onTabClick': function (evt) {
      evt.preventDefault();
      var target = $(evt.currentTarget);
      this.contents.css('display', 'none');
      $('#' + target.data('target')).css('display', 'block');
    }
  });
});
