import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const TooSmallMessageComponent = Base.extend({
  name: 'stylie-too-small-message',
  View,
  template,
});

export default TooSmallMessageComponent;
