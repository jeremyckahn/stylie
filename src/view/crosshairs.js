define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'src/constants'
  ,'src/view/crosshair'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,constant
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
    initialize: function (opts) {
      this.stylie = opts.stylie;
      this._isShowing = true;
      this.crosshairViews = {};
      this.listenTo(this.model, 'change', _.bind(this.render, this));
      this.listenTo(this.stylie, constant.TOGGLE_PATH_AND_CROSSHAIRS,
          _.bind(this.showOrHideCrosshairs, this));
    }

    ,render: function () {
      this.$el.children().detach();

      var orderedViews = _.sortBy(this.crosshairViews,
          function (crosshairView) {
        return crosshairView.model.get('millisecond');
      });

      _.each(orderedViews, function (crosshairView) {
        this.$el.append(crosshairView.$el);
      }, this);
    }

    ,addCrosshairView: function (model) {
      var keyframeCount =
        this.stylie.actorCollection.getCurrent().getLength();
      var $el = $(Mustache.render(CROSSHAIR_TEMPLATE));
      this.$el.append($el);

      this.crosshairViews[model.cid] = new CrosshairView({
        stylie: this.stylie
        ,el: $el[0]
        ,model: model
        ,$container: this.$el.parent()
      });

      this.listenTo(model, 'destroy', _.bind(function () {
        delete this.crosshairViews[model.cid];
      }, this));
    }

    /**
     * @param {boolean} isShowing
     */
    ,showOrHideCrosshairs: function (isShowing) {
      this._isShowing = isShowing;
      if (isShowing) {
        this.$el.removeClass('hidden');
      } else {
        this.$el.addClass('hidden');
      }
    }

  });
});
