define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

  ,'stylie.component.modal'

], function (

  _
  ,Lateralus

  ,template

  ,constant

  ,ModalComponent

) {
  'use strict';

  var Base = ModalComponent.View;
  var baseProto = Base.prototype;

  var LoginComponentView = Base.extend({
    templatePartials: {
      modalContents: template
    }

    ,lateralusEvents: _.extend({
      userRequestToggleLoginModal: function () {
        this.toggle();
      }
    }, baseProto.lateralusEvents)

    ,events: {
      'click .login.twitter': function () {
        this.$twitterLabel.text('Redirecting...');
        window.location = constant.API_URL + '/auth/twitter';
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return LoginComponentView;
});
