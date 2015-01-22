define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ActorContainerComponent = Base.extend({
    name: 'actor-container'
    ,Model: Model
    ,View: View
    ,template: template

    /**
     * @return {string}
     */
    ,getActorHtml: function () {
      return this.view.getActorHtml();
    }
  });

  return ActorContainerComponent;
});
