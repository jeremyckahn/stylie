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

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ExportPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {jQuery} $shownContent
       */
      tabShown: function ($shownContent) {
        if ($shownContent.is(this.$el)) {
          this.emit('requestExportRender');
        }
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'submit form': function (evt) {
        evt.preventDefault();
      }

      ,'change .orientation-form': function () {
        var orientation = _.findWhere(
            this.$orientationForm.serializeArray()
            ,{ name: 'orientation' }
          ).value;

        this.setUserSelectedOrientation(orientation);
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'change .export-format-selector': function (evt) {
        var $target = $(evt.target);
        var exportType = $target.val();

        this.$exportTypePanels.children()
          .addClass('hide')
          .filter('[data-export-type=' + exportType + ']')
            .removeClass('hide');

        this.emit('exportFormatSelected', exportType);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);
      var orientToFirstKeyframe =
        this.lateralus.model.getUi('exportOrientation') === 'first-keyframe';

      _.extend(renderData, {
        orientToFirstKeyframe: orientToFirstKeyframe
      });

      return renderData;
    }

    /**
     * @param {string} orientation "first-keyframe" or "top-left"
     */
    ,setUserSelectedOrientation: function (orientation) {
      this.lateralus.model.setUi('exportOrientation', orientation);
      this.emit('requestExportRender');
    }

    ,renderCss: function () {
      this.emit('requestExportRender');
    }
  });

  return ExportPanelComponentView;
});
