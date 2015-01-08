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

  var CrosshairComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      _.defer(this.deferredInitialize.bind(this));
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.$el.parent()
      });
    }
  });

  return CrosshairComponentView;
});
