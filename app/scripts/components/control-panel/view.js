define([

  'lateralus'

  ,'text!./template.mustache'

  ,'lateralus.component.tabs'

], function (

  Lateralus

  ,template

  ,TabsComponent

) {
  'use strict';

  var ControlPanelComponentView = Lateralus.Component.View.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);

      this.addSubview(TabsComponent.View, {
        $tabsContainer: this.$tabsContainer,
        $tabsContentContainer: this.$tabsContentContainer
      });
    }
  });

  return ControlPanelComponentView;
});
