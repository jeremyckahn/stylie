import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const TimelineScrubberComponent = Base.extend({
  name: 'stylie-timeline-scrubber',
  View: View,
  template: template,
});

export default TimelineScrubberComponent;
