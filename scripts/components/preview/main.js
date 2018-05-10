import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';
import AnimationPathComponent from '../animation-path/main';
import CrosshairContainerComponent from '../crosshair-container/main';
import ActorContainerComponent from '../actor-container/main';
import TimelineScrubberComponent from '../timeline-scrubber/main';

const Base = Lateralus.Component;

const PreviewComponent = Base.extend({
  name: 'stylie-preview',
  View: View,
  template: template,

  initialize: function() {
    this.addComponent(AnimationPathComponent, {
      el: this.view.$animationPath[0],
    });

    this.addComponent(CrosshairContainerComponent, {
      el: this.view.$crosshairContainer[0],
    });

    this.actorContainerComponent = this.addComponent(ActorContainerComponent, {
      el: this.view.$actorContainer[0],
    });

    this.addComponent(TimelineScrubberComponent, {
      el: this.view.$timelineScrubber[0],
    });
  },
});

export default PreviewComponent;
