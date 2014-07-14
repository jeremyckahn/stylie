define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'src/view/crosshair'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,CrosshairView

) {

  var CROSSHAIR_TEMPLATE = [
    '<div class="crosshair">'
      ,'<div class="crosshair-container">'
        ,'<div class="dashmark horiz"></div>'
        ,'<div class="dashmark vert"></div>'
      ,'</div>'
      ,'<div class="rotation-control"></div>'
    ,'</div>'].join('');

  return Backbone.View.extend({

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     */
    'initialize': function (opts) {
      this.stylie = opts.stylie;
      this.crosshairViews = {};
      this.listenTo(this.model, 'change', _.bind(this.render, this));
    }

    ,'render': function () {
      this.$el.children().detach();

      var orderedViews = _.sortBy(this.crosshairViews,
          function (crosshairView) {
        return crosshairView.model.get('millisecond');
      });

      _.each(orderedViews, function (crosshairView) {
        this.$el.append(crosshairView.$el);
      }, this);
    }

    ,'addCrosshairView': function (model) {
      var keyframeCount =
        this.stylie.collection.actors.getCurrent().getLength();
      var $el = $(Mustache.render(CROSSHAIR_TEMPLATE));
      this.$el.append($el);

      this.crosshairViews[model.cid] = new CrosshairView({
        'stylie': this.stylie
        ,'el': $el[0]
        ,'model': model
        ,'owner': this
      });

      this.listenTo(model, 'destroy', _.bind(function () {
        delete this.crosshairViews[model.cid];
      }, this));
    }

  });
});
