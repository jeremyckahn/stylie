define(['lateralus', './view', 'text!./template.mustache'], function(
  Lateralus,
  View,
  template
) {
  'use strict';

  var Base = Lateralus.Component;

  var HeaderComponent = Base.extend({
    name: 'stylie-header',
    View: View,
    template: template,
  });

  return HeaderComponent;
});
