import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const ActorContainerComponent = Base.extend({
  name: 'stylie-actor-container',
  View: View,
  template: template,
});

export default ActorContainerComponent;
