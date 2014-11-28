define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var KeyframeFormComponentView = Lateralus.Component.View.extend({
    template: template

    ,tagName: 'li'

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
    }
  });

  return KeyframeFormComponentView;
});
