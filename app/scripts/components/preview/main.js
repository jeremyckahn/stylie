define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.animation-path'
  ,'stylie.component.crosshair-container'
  ,'stylie.component.actor-container'
  ,'stylie.component.timeline-scrubber'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,AnimationPathComponent
  ,CrosshairContainerComponent
  ,ActorContainerComponent
  ,TimelineScrubberComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var PreviewComponent = Base.extend({
    name: 'preview'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.addComponent(AnimationPathComponent, {
        el: this.view.$animationPath[0]
      });

      this.addComponent(CrosshairContainerComponent, {
        el: this.view.$crosshairContainer[0]
      });

      this.addComponent(ActorContainerComponent, {
        el: this.view.$actorContainer[0]
      });

      this.addComponent(TimelineScrubberComponent, {
        el: this.view.$timelineScrubber[0]
      });
    }
  });

  return PreviewComponent;
});
