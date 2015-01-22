define([

  'jquery'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  $
  ,Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ActorContainerComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {boolean} isCentered
       */
      userRequestUpdateCenteringSetting: function (isCentered) {
        this.setCenteringClass(isCentered);
      }

      /**
       * @param {string} newHtml
       */
      ,userRequestUpdateActorHtml: function (newHtml) {
        this.$actorWrapper.html(newHtml);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.actorModel = this.lateralus.getCurrentActorModel();
      this.actorModel.actor.context = this.$actorWrapper[0];
    }

    /**
     * @param {boolean} isCentered
     */
    ,setCenteringClass: function (isCentered) {
      this.$actorWrapper[isCentered ? 'addClass' : 'removeClass']('centered');
    }

    /**
     * @return {string}
     */
    ,getActorHtml: function () {
      return $.trim(this.$actorWrapper.html());
    }
  });

  return ActorContainerComponentView;
});
