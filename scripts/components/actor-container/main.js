define(['lateralus', './view', 'text!./template.mustache'], function(
  Lateralus,
  View,
  template
) {
  'use strict';

  var Base = Lateralus.Component;

  var ActorContainerComponent = Base.extend({
    name: 'stylie-actor-container',
    View: View,
    template: template,
  });

  return ActorContainerComponent;
});
