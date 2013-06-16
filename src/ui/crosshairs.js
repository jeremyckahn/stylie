define(['src/app', 'src/ui/crosshair'], function (app, CrosshairView) {

  var CROSSHAIR_TEMPLATE = [
    '<div class="crosshair {{extraClass}}" data-pos="{{position}}" data-millisecond="{{ms}}">'
      ,'<div class="dashmark horiz"></div>'
      ,'<div class="dashmark vert"></div>'
      ,'<div class="rotation-arm">'
        ,'<div class="rotation-handle">'
      ,'</div>'
    ,'</div>'].join('');

  function generateCrosshairHtml (extraClass, position, millisecond) {
    return Mustache.render(CROSSHAIR_TEMPLATE, {
      'extraClass': extraClass
      ,'position': position
      ,'millisecond': millisecond
    });
  }

  return Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'addCrosshairView': function (model) {
      var keyframeCount = app.collection.actors.getCurrent().getLength();

      var $el = keyframeCount % 2
          ? $(generateCrosshairHtml('from', 'from', model.get('millisecond')))
          : $(generateCrosshairHtml('to', 'to', model.get('millisecond')));

      this.$el.append($el);

      var crosshairView = new CrosshairView({
        '$el': $el
        ,'model': model
      });
    }

  });
});
