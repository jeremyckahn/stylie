define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'incrementer-field'

  ,'src/constants'
  ,'src/view/ease-select'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,IncrementerFieldView

  ,constant
  ,EaseSelectView

) {

  function incrementerGeneratorHelper ($el) {
    var incrementerFieldView = new IncrementerFieldView({
      el: $el[0]
    });

    incrementerFieldView.onValReenter = _.bind(function (val) {
      this.model.set($el.data('keyframeattr'), +val || 0);
      this.stylie.trigger(constant.PATH_CHANGED);
    }, this);

    return incrementerFieldView;
  }

  var KEYFRAME_TEMPLATE = [
      '<li class="keyframe">'
        ,'<h3></h3>'
        ,'<div class="pinned-button-array">'
        ,'</div>'
      ,'</li>'
    ].join('');

  /* jshint maxlen: 300 */
  var KEYFRAME_PROPERTY_TEMPLATE = [
      '<div class="property-field">'
        ,'<label>'
          ,'<span>{{propertyLabel}}:</span>'
          ,'<input class="quarter-width keyframe-attr-{{property}}" type="text" data-keyframeattr="{{property}}" value="{{value}}">'
        ,'</label>'
      ,'</div>'
    ].join('');

  var REMOVE_KEYFRAME_BUTTON = [
      '<label class="remove">'
        ,'<span>Remove this keyframe</span>'
        ,'<button class="icon icon-remove">&nbsp;</button>'
      ,'</label>'
    ].join('');

  /* jshint maxlen: 100 */
  var EASE_SELECT_TEMPLATE = [
      '<select class="easing {{property}}-easing" data-axis="{{property}}"></select>'
    ].join('');

  var MILLISECOND_INPUT_TEMPLATE = [
      '<input class="millisecond-input" type="text" value="{{value}}">'
    ].join('');

  return Backbone.View.extend({

    events: {
      'click h3': 'editMillisecond'
      ,'click .remove button': 'removeKeyframe'
    }

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {KeyframeModel} model
     */
    ,initialize: function (opts) {
      this.stylie = opts.stylie;

      this.isEditingMillisecond = false;
      this.canEditMillisecond = !this.isFirstKeyfame();

      this.$el = $(KEYFRAME_TEMPLATE);
      this.initDOMReferences();
      this.buildDOM();
      this.listenTo(this.model, 'change', _.bind(this.render, this));
      this.listenTo(this.model, 'destroy', _.bind(this.teardown, this));
      this.initIncrementers();
      this.render();
    }

    ,buildDOM: function () {
      var isFirstKeyfame = this.isFirstKeyfame();

      if (this.isRemovable()) {
        var $template = $(Mustache.render(REMOVE_KEYFRAME_BUTTON));
        this.$pinnedButtonArray.append($template);
      }

      _.each(['x', 'y', 'scale', 'rX', 'rY', 'rZ'], function (property) {
        // TODO: This is ugly!  Make it not ugly!
        var propertyLabel = property === 'scale' ? 'S' : property.toUpperCase();

        var template = Mustache.render(KEYFRAME_PROPERTY_TEMPLATE, {
          property: property
          ,propertyLabel: propertyLabel
          ,value: this.model.get(property)
        });

        var $template = $(template);

        if (!isFirstKeyfame) {
          var easeSelectView = this.initEaseSelect(property);
          $template.append(easeSelectView.$el);
        }

        this['$input' + property.toUpperCase()] = $template;
        this.$el.append($template);
      }, this);
    }

    ,initDOMReferences: function () {
      this.$header = this.$el.find('h3');
      this.$pinnedButtonArray = this.$el.find('.pinned-button-array');
    }

    ,initIncrementers: function () {
      _.each([
          this.$inputX,
          this.$inputY,
          this.$inputSCALE,
          this.$inputRX,
          this.$inputRY,
          this.$inputRZ], function ($el) {
        var $input = $el.find('input');
        var keyframeAttr = $input.data('keyframeattr');
        this['incrementerView' + keyframeAttr.toUpperCase()] =
            incrementerGeneratorHelper.call(this, $input);
      }, this);

      this.incrementerViewSCALE.increment = 0.1;
      this.incrementerViewSCALE.mousewheelIncrement = 0.1;

      if (!this.isFirstKeyfame()) {
        var template = Mustache.render(MILLISECOND_INPUT_TEMPLATE, {
          value: this.model.get('millisecond')
        });

        var millisecondIncrementer = new IncrementerFieldView({
          el: $(template)[0]
        });

        millisecondIncrementer.onBlur =
            _.bind(this.onMillisecondIncrementerBlur, this);

        // Defer to the blur event handler for all code paths that call
        // onMillisecondIncrementerBlur.  It's a browser-level event and
        // inserts its handler into the JavaScript thread synchronously,
        // creating null pointers that jQuery is not expecting in
        // jQuery#remove.
        millisecondIncrementer.onEnterDown = function (evt) {
          evt.preventDefault();
          millisecondIncrementer.freeMousewheel();
          millisecondIncrementer.$el.trigger('blur');
        };

        millisecondIncrementer.delegateEvents();
        this.millisecondIncrementer = millisecondIncrementer;
      }
    }

    ,initEaseSelect: function (propertyName, previousSibling) {
      var viewName = 'easeSelectView' + propertyName.toUpperCase();
      var inputName = 'input'  + propertyName.toUpperCase();
      var template = Mustache.render(EASE_SELECT_TEMPLATE, {
        property: propertyName
      });

      var view = this[viewName] = new EaseSelectView({
        el: $(template)[0]
        ,model: this.model
      });

      this.listenTo(view, 'change', _.bind(this.updateEasingString, this));

      return view;
    }

    ,getKeyframeIndex: function () {
      return this.model.collection.indexOf(this.model);
    }

    ,isFirstKeyfame: function () {
      return this.getKeyframeIndex() === 0;
    }

    ,isRemovable: function () {
      return this.getKeyframeIndex() > 0;
    }

    ,onMillisecondIncrementerBlur: function (evt) {
      this.millisecondIncrementer.$el.detach();
      var millisecond = this.validateMillisecond(
          this.millisecondIncrementer.$el.val());

      this.model.moveTo(millisecond);
      this.renderHeader();
      this.isEditingMillisecond = false;
    }

    ,render: function () {
      this.renderHeader();

      ['x', 'y', 'scale', 'rX', 'rY', 'rZ'].forEach(function (axis) {
        var upperAxis = axis.toUpperCase();
        var axisValue = this.model.get(axis);
        var incrementerView = this['incrementerView' + upperAxis];

        if (axisValue !== parseFloat(this['$input' + upperAxis].val()) &&
          incrementerView.$el[0] !== document.activeElement) {

          incrementerView.$el.val(axisValue);
        }
      }, this);
    }

    ,renderHeader: function () {
      this.$header.text(this.model.get('millisecond'));
    }

    ,updateEasingString: function () {
      var xEasing = this.easeSelectViewX.$el.val();
      var yEasing = this.easeSelectViewY.$el.val();
      var scaleEasing = this.easeSelectViewSCALE.$el.val();
      var rXEasing = this.easeSelectViewRX.$el.val();
      var rYEasing = this.easeSelectViewRY.$el.val();
      var rZEasing = this.easeSelectViewRZ.$el.val();
      var newEasingString = [
          xEasing, yEasing, scaleEasing, rXEasing, rYEasing, rZEasing].join(' ');

      this.model.set('easing', newEasingString);
      this.stylie.trigger(constant.PATH_CHANGED);
    }

    ,validateMillisecond: function (millisecond) {
      return isNaN(millisecond)
        ? 0
        : Math.abs(+millisecond);
    }

    ,editMillisecond: function () {
      if (this.isEditingMillisecond || !this.canEditMillisecond) {
        return;
      }

      this.isEditingMillisecond = true;

      this.$header
        .empty()
        .append(this.millisecondIncrementer.$el);

      this.millisecondIncrementer.$el
        .val(this.model.get('millisecond'))
        .focus();
    }

    ,removeKeyframe: function () {
      this.model.destroy();
    }

    ,teardown: function () {
      if (this.model.get('millisecond') > 0) {
        _.each(['X', 'Y', 'SCALE', 'RX', 'RY', 'RZ'], function (axis) {
          if (!this.isFirstKeyfame()) {
            this['easeSelectView' + axis].teardown();
          }

          this['incrementerView' + axis].teardown();
          this['$input' + axis].remove();
        }, this);

        if (!this.isFirstKeyfame()) {
          this.millisecondIncrementer.teardown();
        }
      }

      this.$header.remove();
      this.$pinnedButtonArray.remove();
      this.remove();
      _.empty(this);
    }

  });
});
