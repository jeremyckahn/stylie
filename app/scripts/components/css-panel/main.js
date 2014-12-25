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

  var Base = Lateralus.Component;

  var CssPanelComponent = Base.extend({
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
