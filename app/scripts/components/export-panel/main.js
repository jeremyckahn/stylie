define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.css-export-panel'
  ,'stylie.component.rekapi-export-panel'

], function (

  Lateralus

  ,View
  ,template

  ,CssExportPanelComponent
  ,RekapiExportPanelComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ExportPanelComponent = Base.extend({
    name: 'export-panel'
    ,View: View
    ,template: template

    ,initialize: function () {
      this.cssExportPanelComponent = this.addComponent(
          CssExportPanelComponent, {
        el: this.view.$cssExportPanel[0]
      });

      this.rekapiExportPanelComponent = this.addComponent(
          RekapiExportPanelComponent, {
        el: this.view.$rekapiExportPanel[0]
      });
    }

    /**
     * TODO: This is overly specific legacy code.  It probably should not exist
     * anymore.  Callers of this should instead be concerned with retrieving
     * CSS export data in a more decoupled fashion.
     *
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>
     * }}
     */
    ,toJSON: function () {
      return this.cssExportPanelComponent.view.toJSON();
    }
  });

  return ExportPanelComponent;
});
