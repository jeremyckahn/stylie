define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var CssExportPanelComponent = Base.extend({
    name: 'css-export-panel'
    ,Model: Model
    ,View: View
    ,template: template

    /**
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>
     * }}
     */
    ,toJSON: function () {
      return this.view.toJSON();
    }
  });

  return CssExportPanelComponent;
});
