define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ActorContainerComponent = Base.extend({
    name: 'actor-container'
    ,View: View
    ,template: template
  });

  return ActorContainerComponent;
});
