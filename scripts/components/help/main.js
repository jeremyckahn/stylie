import ModalComponent from 'aenima/components/modal/main';
import View from './view';
import template from 'text!./template.mustache';

const Base = ModalComponent;

const HelpComponent = Base.extend({
  name: 'stylie-help',
  View,
  template,
});

export default HelpComponent;
