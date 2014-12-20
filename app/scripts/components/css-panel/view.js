define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var VENDORS = [
    { id: 'moz', label: 'Mozilla' }
    ,{ id: 'ms', label: 'Microsoft' }
    ,{ id: 'o', label: 'Opera' }
    ,{ id: 'webkit', label: 'WebKit' }
    ,{ id: 'w3', label: 'W3C' }
  ];

  var CssPanelComponentView = Lateralus.Component.View.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);

      this.$w3Checkbox.prop('checked', true);

      this.listenFor('timelineModified', this.onTimelineModified.bind(this));
      this.listenFor('tabShown', this.onTabShown.bind(this));
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      _.extend(renderData, {
        vendors: VENDORS
      });

      return renderData;
    }

    ,onTimelineModified: function () {
      if (this.$el.is(':visible')) {
        this.renderCss();
      }
    }

    /**
     * @param {jQuery} $shownContent
     */
    ,onTabShown: function ($shownContent) {
      if ($shownContent.is(this.$el)) {
        this.renderCss();
      }
    }

    ,renderCss: function () {
      var css = this.lateralus.rekapiComponent.getCssString();
      this.$generatedCss.val(css);
    }
  });

  return CssPanelComponentView;
});
