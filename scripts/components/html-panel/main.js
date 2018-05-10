import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const HtmlPanelComponent = Base.extend({
  name: 'stylie-html-panel',
  View: View,
  template: template,
});

export default HtmlPanelComponent;
