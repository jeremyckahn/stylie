import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var ActorContainerComponent = Base.extend({
  name: 'stylie-actor-container',
  View: View,
  template: template,
});

export default ActorContainerComponent;
