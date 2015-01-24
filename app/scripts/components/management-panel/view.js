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

  var ManagementPanelComponentView = Base.extend({
    template: template

    ,events: {
      'click .save button': function () {
        this.emit('userRequestSaveCurrentAnimation', this.$saveInput.val());
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ManagementPanelComponentView;
});
