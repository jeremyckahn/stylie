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

  var VENDORS = [
    { id: 'mozilla', label: 'Mozilla' }
    ,{ id: 'microsoft', label: 'Microsoft' }
    ,{ id: 'opera', label: 'Opera' }
    ,{ id: 'webkit', label: 'WebKit' }
    ,{ id: 'w3', label: 'W3C' }
  ];

  var CssExportPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      timelineModified: function () {
        this.renderCssIfVisible();
      }

      ,requestExportRender: function () {
        this.renderCssIfVisible();
      }
    }

    ,events: {
      'keyup .update-on-keyup': function () {
        this.renderCss();
      }

      ,'change .update-on-change': function () {
        this.renderCss();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.$w3Checkbox.prop('checked', true);
    }

    ,deferredInitialize: function () {
      this.renderCss();
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        vendors: VENDORS
      });

      return renderData;
    }

    ,renderCssIfVisible: function () {
      if (this.$el.is(':visible')) {
        this.renderCss();
      }
    }

    ,renderCss: function () {
      var cssOpts = this.collectOne('cssConfigObject');

      var css = this.lateralus.rekapiComponent.getCssString(cssOpts);
      this.$generatedCss.val(css);
    }

    /**
     * @return {Array.<string>}
     */
    ,getSelectedVendorList: function () {
      var accumulator = [];

      VENDORS.forEach(function (vendor) {
        var id = vendor.id;

        if (this['$' + id + 'Checkbox'].is(':checked')) {
          accumulator.push(id);
        }
      }, this);

      return accumulator;
    }

    /**
     * @return {boolean|undefined}
     */
    ,getIterations: function () {
      var iterationValue = +this.$iterations.val();
      return isNaN(iterationValue) ? undefined : iterationValue;
    }

    /**
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>,
     *   iterations: boolean|undefined
     * }}
     */
    ,toJSON: function () {
      return {
        name: this.$className.val()
        ,fps: +this.$cssSizeOutput.val()
        ,vendors: this.getSelectedVendorList()
        ,iterations: this.getIterations()
      };
    }
  });

  return CssExportPanelComponentView;
});
