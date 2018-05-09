define(['lateralus', './view', 'text!./template.mustache'], function(
  Lateralus,
  View,
  template
) {
  'use strict';

  var Base = Lateralus.Component;

  var TooSmallMessageComponent = Base.extend({
    name: 'stylie-too-small-message',
    View: View,
    template: template,
  });

  return TooSmallMessageComponent;
});
