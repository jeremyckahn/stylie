import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const HeaderComponent = Base.extend({
  name: 'stylie-header',
  View: View,
  template: template,
});

export default HeaderComponent;
