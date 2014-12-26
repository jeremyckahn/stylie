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

  var CssPanelComponentView = Base.extend({
    template: template

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'submit form': function (evt) {
        evt.preventDefault();
      }

      ,'keyup .update-on-keyup': function () {
        this.renderCss();
      }

      ,'change .update-on-change': function () {
        this.renderCss();
      }

      ,'change .orientation-form': function () {
        var orientation = _.findWhere(
            this.$orientationForm.serializeArray()
            ,{ name: 'orientation' }
          ).value;

        this.setUserSelectedOrientation(orientation);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.$w3Checkbox.prop('checked', true);

      this.listenFor('timelineModified', this.onTimelineModified.bind(this));
      this.listenFor('tabShown', this.onTabShown.bind(this));

      _.defer(this.renderCss.bind(this));
    }

    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

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

    /**
     * @param {string} orientation "first-keyframe" or "top-left"
     */
    ,setUserSelectedOrientation: function (orientation) {
      this.emit('userSelectedOrientation', orientation);
      this.renderCss();
    }

    ,renderCss: function () {
      var cssOpts = this.lateralus.getCssConfigObject();

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
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>
     * }}
     */
    ,toJSON: function () {
      return {
        name: this.$className.val()
        ,fps: +this.$cssSizeOutput.val()
        ,vendors: this.getSelectedVendorList()
      };
    }
  });

  return CssPanelComponentView;
});
