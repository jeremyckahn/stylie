define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/view/background'

], function (

  $
  ,_
  ,Backbone

  ,BackgroundView

) {

  var $win = $(window);

  return Backbone.View.extend({

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {jQuery} $canvasBG
     */
    'initialize': function (opts) {
      this.stylie = opts.stylie;
      this.$canvasBG = opts.$canvasBG;
      this.initDOM();
    }

    ,'initDOM': function () {
      var height = $win.height();
      var width = $win.width();

      // There is only one header in the DOM.
      this.$header = $('header');
      this.backgroundView = new BackgroundView({
        'stylie': this.stylie
        ,'el': this.$canvasBG[0]
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
