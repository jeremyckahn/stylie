define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var CssPanelComponent = Lateralus.Component.extend({
    name: 'css-panel'
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

  return CssPanelComponent;
});
