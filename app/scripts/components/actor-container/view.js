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

    ,provide: {
      /**
       * @return {string}
       */
      actorHtml: function () {
        return $.trim(this.$actorWrapper.html());
      }
    }

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

      // TODO: This should be emitting a context, not collecting an object and
      // augmenting it.
      this.actorModel = this.collectOne('currentActorModel');
      this.actorModel.actor.context = this.$actorWrapper[0];
      this.setCenteringClass(this.lateralus.model.getUi('centerToPath'));
    }

    /**
     * @param {boolean} isCentered
     */
    ,setCenteringClass: function (isCentered) {
      this.$actorWrapper[isCentered ? 'addClass' : 'removeClass']('centered');
    }
  });

  return ActorContainerComponentView;
});
