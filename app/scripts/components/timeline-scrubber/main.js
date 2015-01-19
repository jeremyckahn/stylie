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

  var TimelineScrubberComponent = Base.extend({
    name: 'timeline-scrubber'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return TimelineScrubberComponent;
});
