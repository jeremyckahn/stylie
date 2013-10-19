define([
    'src/app', 'src/constants', 'src/ui/incrementer-field'

    ], function (

    app, constant, IncrementerFieldView

    ) {

  return Backbone.View.extend({

    'events': {
      'click .icon-plus': 'addEasing'
      ,'change .bezierizer': 'onBezierizerChange'
      ,'change .custom-ease-select': 'onCurveSelectChange'
    }


    ,'initialize': function (opts) {
      _.extend(this, opts);
      this._$easingSelect = this.$el.find('.custom-ease-select');
      this._$bezierizer = this.$el.find('.bezierizer');
      this._bezierizer = new Bezierizer(this._$bezierizer[0]);
      this._defaultBezierizerPoints = this._bezierizer.getHandlePositions();
      this._curvePoints = {};
      var bezierizerPoints = this._bezierizer.getHandlePositions();

      this.$el.find('.bezier-point').each(_.bind(function (i, el) {
        var $el = $(el);
        var point = $el.data('point');
        $el.val(bezierizerPoints[point]);

        this['incrementer' + point.toUpperCase()] = new IncrementerFieldView({
          '$el': $el
          ,'increment': 0.1
          ,'onValReenter': _.bind(this.onControlPointValReenter, this, point)
        });
      }, this));

      this.addEasing();
      this.updateCurrentBezierCurve();
    }


    ,'onControlPointValReenter': function (point, val) {
      var handlePositions = {};
      handlePositions[point] = val;
      this._bezierizer.setHandlePositions(handlePositions);
      this.updateCurrentBezierCurve();
    }


    ,'onBezierizerChange': function (evt) {
      this.updateCurrentBezierCurve();
      this.updateControlPointFields();
    }


    ,'onCurveSelectChange': function (evt) {
      var currentEasing = this._$easingSelect.val();
      var storedCurvePoints = this._curvePoints[currentEasing];
      this._bezierizer.setHandlePositions({
           'x1': storedCurvePoints.x1
          ,'y1': storedCurvePoints.y1
          ,'x2': storedCurvePoints.x2
          ,'y2': storedCurvePoints.y2
        });
    }


    ,'addEasing': function () {
      var easingName =
          'customEasing' + (this._$easingSelect.children().length + 1);
      var $option = $(document.createElement('option'));
      $option
        .val(easingName)
        .text(easingName);
      $('#control-pane select.easing').append($option);
      this._$easingSelect.val(easingName);
      this._bezierizer.setHandlePositions(this._defaultBezierizerPoints);
      this._curvePoints[easingName] = this._bezierizer.getHandlePositions();
      this.updateCurrentBezierCurve();
    }


    ,'updateCurrentBezierCurve': function () {
      var currentEasing = this._$easingSelect.val();
      var handlePositions = this._bezierizer.getHandlePositions();
      this._curvePoints[currentEasing] = handlePositions;

      Tweenable.setBezierFunction(currentEasing,
          handlePositions.x1, handlePositions.y1,
          handlePositions.x2, handlePositions.y2);

      var kapi = app.kapi;
      if (!kapi.isPlaying()) {
        kapi.update();
      }

      publish(constant.PATH_CHANGED);
      app.collection.actors.getCurrent().updateKeyframeFormViews();
    }


    ,'updateControlPointFields': function () {
      var handlePositions = this._bezierizer.getHandlePositions();

      _.each(['x1', 'y1', 'x2', 'y2'], function (point) {
        var val = handlePositions[point].toPrecision(6);
        this['incrementer' + point.toUpperCase()].$el.val(val);
      }, this);
    }
  });
});
