define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.modal'

], function (

  _
  ,Lateralus

  ,template

  ,ModalComponent

) {
  'use strict';

  var Base = ModalComponent.View;
  var baseProto = Base.prototype;

  var HelpComponentView = Base.extend({
    templatePartials: {
      modalContents: template
    }

    ,lateralusEvents: _.extend({
      userRequestToggleHelpModal: function () {
        this.toggle();
      }
    }, baseProto.lateralusEvents)

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return HelpComponentView;
});
