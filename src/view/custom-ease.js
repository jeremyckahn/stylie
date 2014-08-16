define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'shifty'
  ,'bezierizer'

  ,'incrementer-field'

  ,'src/constants'

], function (

  $
  ,_
  ,Backbone
  ,Tweenable
  ,Bezierizer

  ,IncrementerFieldView

  ,constant

) {

  return Backbone.View.extend({

    events: {
      'click .icon-plus': 'onClickPlusIcon'
      ,'change .bezierizer': 'onBezierizerChange'
      ,'change .custom-ease-select': 'onCurveSelectChange'
    }


    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;
      this._$easingSelect = this.$el.find('.custom-ease-select');
      this._$bezierizer = this.$el.find('.bezierizer');
      this._bezierizer = new Bezierizer(this._$bezierizer[0]);
      this._defaultBezierizerPoints = this._bezierizer.getHandlePositions();
      var bezierizerPoints = this._defaultBezierizerPoints;
      this._curvePoints = {};
      this._$bezierizerPointInputs = this.$el.find('.bezier-point');

      this._$bezierizerPointInputs.each(_.bind(function (i, el) {
        var $el = $(el);
        var point = $el.data('point');
        $el.val(bezierizerPoints[point]);

        var incrementerFieldView = new IncrementerFieldView({
          el: el
        });
        incrementerFieldView.increment = 0.01;
        incrementerFieldView.mousewheelIncrement = 0.01;
        incrementerFieldView.onValReenter =
            _.bind(this.onControlPointValReenter, this, point);

        this['incrementer' + point.toUpperCase()] = incrementerFieldView;
      }, this));

      this.addEasing('customEasing1', bezierizerPoints);
      this.updateCurrentBezierCurve();
    }


    ,onControlPointValReenter: function (point, val) {
      var handlePositions = {};
      handlePositions[point] = val;
      this._bezierizer.setHandlePositions(handlePositions);
      this.updateCurrentBezierCurve();
    }


    ,onBezierizerChange: function (evt) {
      this.updateCurrentBezierCurve();
      this.updateControlPointFields();
    }


    ,onCurveSelectChange: function (evt) {
      var currentEasing = this._$easingSelect.val();
      var storedCurvePoints = this._curvePoints[currentEasing];
      this._bezierizer.setHandlePositions({
           x1: storedCurvePoints.x1
          ,y1: storedCurvePoints.y1
          ,x2: storedCurvePoints.x2
          ,y2: storedCurvePoints.y2
        });
      this.updateControlPointFields();
    }

    ,onClickPlusIcon: function () {
      var easingName =
          'customEasing' + (this._$easingSelect.children().length + 1);
      this.addEasing(easingName, this._defaultBezierizerPoints);
    }


    ,addEasing: function (easingName, bezierizerPoints) {
      var $option = $(document.createElement('option'));
      $option
        .val(easingName)
        .text(easingName);
      $('#control-pane select.easing').append($option);
      this._$easingSelect.val(easingName);
      this._bezierizer.setHandlePositions(bezierizerPoints);
      this._curvePoints[easingName] = this._bezierizer.getHandlePositions();
      this.updateCurrentBezierCurve();
      this.updateControlPointFields();
    }


    ,removeEasing: function (easingName) {
      Tweenable.unsetBezierFunction(easingName);

      $('#control-pane select.easing option').each(function (i, el) {
        // No need to jQuery-ify the <option>, this _should_ work
        // cross-browser.
        if (el.value === easingName) {
          el.remove();
        }
      });
    }


    ,removeAllEasings: function () {
      _.each(Tweenable.prototype.formula, function (fn, fnName) {
        if (fnName.match(/customEasing/)) {
          this.removeEasing(fnName);
        }
      }, this);

      var bezierizerPoints = this._defaultBezierizerPoints;
      this._bezierizer.setHandlePositions(bezierizerPoints);

      this._$bezierizerPointInputs.each(_.bind(function (i, el) {
        var $el = $(el);
        var point = $el.data('point');
        $el.val(bezierizerPoints[point]);
      }, this));
    }


    ,updateCurrentBezierCurve: function () {
      var currentEasing = this._$easingSelect.val();
      var handlePositions = this._bezierizer.getHandlePositions();
      this._curvePoints[currentEasing] = handlePositions;

      Tweenable.setBezierFunction(currentEasing,
          handlePositions.x1, handlePositions.y1,
          handlePositions.x2, handlePositions.y2);

      var rekapi = this.stylie.rekapi;
      if (!rekapi.isPlaying()) {
        rekapi.update();
      }

      this.stylie.trigger(constant.PATH_CHANGED);
    }


    ,updateControlPointFields: function () {
      var handlePositions = this._bezierizer.getHandlePositions();

      _.each(['x1', 'y1', 'x2', 'y2'], function (point) {
        var val = handlePositions[point].toPrecision(6);
        this['incrementer' + point.toUpperCase()].$el.val(val);
      }, this);
    }
  });
});
