import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var HtmlPanelComponent = Base.extend({
  name: 'stylie-html-panel',
  View: View,
  template: template,
});

export default HtmlPanelComponent;
