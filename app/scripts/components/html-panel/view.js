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

  var HtmlPanelComponentView = Base.extend({
    template: template

    ,events: {
      'keydown textarea': function () {
        this.emit('userRequestUpdateActorHtml', this.$html.val());
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,deferredInitialize: function () {
      this.$html.html(this.lateralus.getCurrentActorHtml());
    }
  });

  return HtmlPanelComponentView;
});
