import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var TimelineScrubberComponent = Base.extend({
  name: 'stylie-timeline-scrubber',
  View: View,
  template: template,
});

export default TimelineScrubberComponent;
