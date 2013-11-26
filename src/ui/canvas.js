define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/app'
  ,'src/constants'
  ,'src/ui/background'

], function (

  $
  ,_
  ,Backbone

  ,app
  ,constant
  ,BackgroundView

) {

  var $win = $(window);

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.initDOM();
    }

    ,'initDOM': function () {
      var height = $win.height();
      var width = $win.width();

      // There is only one header in the DOM.
      this.$header = $('header');
      this.backgroundView = new BackgroundView({
        '$el': this.$canvasBG
        ,'height': height
        ,'width': width
      });
      $win.on('resize', _.bind(this.onWindowResize, this));
    }

    ,'onWindowResize': function (evt) {
      var height = $win.height() - this.$header.outerHeight();
      var width = $win.width();
      this.backgroundView.resize({
        'height': height
        ,'width': width
      });
      this.backgroundView.update();
    }

  });

});
