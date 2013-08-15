define(['src/app', 'src/ui/crosshair'], function (app, CrosshairView) {

  var CROSSHAIR_TEMPLATE = [
    '<div class="crosshair">'
      ,'<div class="crosshair-container">'
        ,'<div class="dashmark horiz"></div>'
        ,'<div class="dashmark vert"></div>'
      ,'</div>'
      ,'<div class="rotation-control"></div>'
    ,'</div>'].join('');

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.crosshairViews = {};
    }

    ,'addCrosshairView': function (model) {
      var keyframeCount = app.collection.actors.getCurrent().getLength();
      var $el = $(Mustache.render(CROSSHAIR_TEMPLATE));
      this.$el.append($el);

      this.crosshairViews[model.cid] = new CrosshairView({
        '$el': $el
        ,'model': model
        ,'owner': this
      });
    }

    ,'reorderCrosshairViews': function () {
      this.$el.children().detach();
      var crosshairViews = this.model.getCrosshairViews();
      _.each(crosshairViews, function (crosshairView) {
        this.$el.append(crosshairView.$el);
      }, this);
    }


  });
});
