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

    ,events: _.extend({
      'click .login .twitter': function () {
        this.$twitterLabel.text(constant.REDIRECTING_MESSAGE);
        window.location = constant.API_URL + '/auth/twitter';
      }

      ,'click .logout button': function () {
        this.lateralus.logout();
      }
    }, baseProto.events)

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var data = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(data, {
        username: this.lateralus.model.get('username')
      });

      return data;
    }
  });

  return LoginComponentView;
});
