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

  var HeaderComponentView = Base.extend({
    template: template

    ,events: {
      'click .help': function () {
        this.$help.blur();
        this.emit('userRequestToggleHelpModal');
      }

      ,'click .reset': function () {
        this.emit('userRequestResetAnimation');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return HeaderComponentView;
});
