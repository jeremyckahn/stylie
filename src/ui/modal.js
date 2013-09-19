define(['src/app', 'src/constants'], function (app, constant) {

  var $win = $(window);

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);

      this.$el
        .css('display', 'none')
        .removeClass('hid');

      this._windowKeyhandler = _.bind(this.onWindowKeydown, this);
      this._windowClickhandler = _.bind(this.onWindowClick, this);
      this.$triggerEl.on('click', _.bind(this.onTriggerClick, this));
    }

    ,'onTriggerClick': function (evt) {
      this.toggle();
      evt.stopPropagation();
      evt.preventDefault();
    }

    ,'onWindowKeydown': function (evt) {
      if (evt.keyCode === 27) { // escape
        this.hide();
      }
    }

    ,'onWindowClick': function (evt) {
      var target = evt.target;
      if (!$.contains(this.$el[0], target) && this.$el[0] !== target) {
        this.hide();
      }
    }

    ,'show': function () {
      this.$el.fadeIn(constant.TOGGLE_FADE_SPEED);
      $win
        .on('keydown', this._windowKeyhandler)
        .on('click', this._windowClickhandler);
    }


    ,'hide': function () {
      this.$el.fadeOut(constant.TOGGLE_FADE_SPEED);
      $win
        .off('keydown', this._windowKeyhandler)
        .off('click', this._windowClickhandler);
    }

    ,'toggle': function () {
      if (this.$el.is(':visible')) {
        this.hide();
      } else {
        this.show();
      }
    }

  });

});

