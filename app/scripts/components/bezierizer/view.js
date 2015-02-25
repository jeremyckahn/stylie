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

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var HANDLE_NAME_LIST = ['x1', 'y1', 'x2', 'y2'];

  var BezierizerComponentView = Base.extend({
    template: template

    ,modelEvents: {
      change: function () {
        this.syncUiToModel();
      }

      ,invalid: function () {
        this.lateralus.warn(this.model.validationError);
        this.syncUiToModel();
      }
    }

    ,events: {
      'change .bezierizer-control': function () {
        this.model.set(this.getHandlePositions());
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'change input[type=number]': function (evt) {
        var target = evt.target;
        this.syncModelToNumberInput(target);
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'mousewheel input[type=number]': function (evt) {
        var target = evt.target;

        if (document.activeElement === target) {
          this.syncModelToNumberInput(target);
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      // this.bezierizer won't be set up until deferredInitialize is complete,
      // so stub out the API that syncUiToModel depends on to prevent extra
      // null checks after initialization.
      this.bezierizer = { setHandlePositions: _.noop };
    }

    ,deferredInitialize: function () {
      // The bulk of initialization logic for this View needs to be deferred
      // because Bezierizer reads styles from the DOM which are only available
      // after the DOM has been built and rendered.
      this.bezierizer = new Bezierizer(this.$bezierizerControl[0]);
      this.syncUiToModel();
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
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

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

    ,syncUiToModel: function () {
      HANDLE_NAME_LIST.forEach(function (handleName) {
        var handleValue = this.model.get(handleName);
        this['$' + handleName].val(handleValue);
      }, this);

      this.bezierizer.setHandlePositions(this.model.toJSON());
    }
  });

  return BezierizerComponentView;
});
