define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var RekapiExportPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      timelineModified: function () {
        this.renderJsonIfVisible();
      }

      ,requestExportRender: function () {
        this.renderJsonIfVisible();
      }

      /**
       * @param {string} exportType
       */
      ,exportFormatSelected: function (exportType) {
        if (exportType === 'rekapi') {
          this.renderJson();
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,renderJsonIfVisible: function () {
      if (this.$el.is(':visible')) {
        this.renderJson();
      }
    }

    ,renderJson: function () {
      var exportString =
        JSON.stringify(this.collectOne('timelineExport'), null, 2);
      this.$generatedJs.val(exportString);
    }
  });

  return RekapiExportPanelComponentView;
});
