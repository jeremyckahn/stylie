define(['lateralus', './view', 'text!./template.mustache'], function(
  Lateralus,
  View,
  template
) {
  'use strict';

  var Base = Lateralus.Component;

  var CrosshairComponent = Base.extend({
    name: 'stylie-crosshair',
    View: View,
    template: template,
  });

  return CrosshairComponent;
});
