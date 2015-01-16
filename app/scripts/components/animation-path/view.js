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

  var AnimationPathComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @param {Rekapi} rekapi
     */
    ,updatePath: function (rekapi) {
    }
  });

  return AnimationPathComponentView;
});
