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

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
      this.listenTo(this.model, 'change', this.onModelChange.bind(this));

      _.defer(this.initBezierizer.bind(this));
    }

    ,initBezierizer: function () {
      this.bezierizer = new Bezierizer(this.$bezierizerControl[0]);
      this.bezierizer.$el.on('change', this.onBezierizerChange.bind(this));
    }

    ,onBezierizerChange: function () {
      this.model.set(this.bezierizer.getHandlePositions());
    }

    ,onModelChange: function () {
      this.syncUIToModel();
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      _.extend(renderData, {
        handleNames: HANDLE_NAME_LIST
      });

      return renderData;
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
