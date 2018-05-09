import ModalComponent from 'aenima/components/modal/main';
import View from './view';
import template from 'text!./template.mustache';

var Base = ModalComponent;

var HelpComponent = Base.extend({
  name: 'stylie-help',
  View: View,
  template: template,
});

export default HelpComponent;
