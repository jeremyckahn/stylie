define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'bezierizer'

], function (

  _
  ,Lateralus

  ,template

  ,Bezierizer

) {
  'use strict';

  var HANDLE_NAME_LIST = ['x1', 'y1', 'x2', 'y2'];

  var BezierizerComponentView = Lateralus.Component.View.extend({
    template: template

    ,events: {
      'change input[type=number]': 'onChangeNumberInput'
      ,'mousewheel input[type=number]': 'onMousewheelNumberInput'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments, BezierizerComponentView);
      this.listenTo(this.model, 'change', this.onModelChange.bind(this));
      this.listenTo(this.model, 'invalid', this.onModelInvalid.bind(this));

      _.defer(this.deferredInitialize.bind(this));
    }

    ,deferredInitialize: function () {
      this.bezierizer = new Bezierizer(this.$bezierizerControl[0]);
      this.bezierizer.$el.on('change', this.onBezierizerChange.bind(this));
      this.syncUIToModel();
    }

    ,onBezierizerChange: function () {
      this.model.set(this.getHandlePositions());
    }

    ,onModelChange: function () {
      this.syncUIToModel();
    }

    ,onModelInvalid: function () {
      this.lateralus.warn(this.model.validationError);
      this.syncUIToModel();
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onChangeNumberInput: function (evt) {
      var target = evt.target;
      this.syncModelToNumberInput(target);
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onMousewheelNumberInput: function (evt) {
      var target = evt.target;

      if (document.activeElement === target) {
        this.syncModelToNumberInput(target);
      }
    }

    /**
     * @param {HTMLInputElement} numberInput
     */
    ,syncModelToNumberInput: function (numberInput) {
      var $numberInput = $(numberInput);
      var handleName = $numberInput.data('handleName');
      this.model.set(handleName, numberInput.valueAsNumber, { validate: true });
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super(
        'getTemplateRenderData', arguments, BezierizerComponentView);

      _.extend(renderData, {
        handleNames: HANDLE_NAME_LIST
      });

      return renderData;
    }

    /**
     * @return {{ x1: number, y1: number, x2: number, y2: number }} All values
     * are constrained to a fixed precision of 2.
     */
    ,getHandlePositions: function () {
      return _.each(this.bezierizer.getHandlePositions()
          ,function (value, handleName, handleObj) {
        handleObj[handleName] = +value.toFixed(2);
      });
    }

    ,syncUIToModel: function () {
      HANDLE_NAME_LIST.forEach(function (handleName) {
        var handleValue = this.model.get(handleName);
        this['$' + handleName].val(handleValue);
      }, this);

      this.bezierizer.setHandlePositions(this.model.toJSON());
    }
  });

  return BezierizerComponentView;
});
