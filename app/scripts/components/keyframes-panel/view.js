define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.keyframe-form'

], function (

  _
  ,Lateralus

  ,template

  ,KeyframeFormComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframesPanelComponentView = Base.extend({
    template: template

    ,events: {
      'click .add-keyframe': function () {
        this.emit('userRequestNewKeyframe');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframeFormComponents = [];

      this.listenFor(
        'keyframePropertyAdded', this.onKeyframePropertyAdded.bind(this));
      this.listenFor(
        'confirmNewKeyframeOrder', this.onConfirmNewKeyframeOrder.bind(this));
    }

    /**
     * @param {Backbone.Model} keyframePropertyModel
     */
    ,onKeyframePropertyAdded: function (keyframePropertyModel) {
      var keyframeFormComponent = this.addComponent(KeyframeFormComponent, {
        model: keyframePropertyModel
      });

      this.keyframeFormComponents.push(keyframeFormComponent);

      // TODO: This is a weird pattern.  Maybe use a proper Model/Collection
      // pattern that automatically cleans itself up?
      this.listenTo(keyframeFormComponent, 'beforeDispose', function () {
        this.keyframeFormComponents =
          _.without(this.keyframeFormComponents, keyframeFormComponent);
      }.bind(this));

      this.$keyframesList.append(keyframeFormComponent.view.el);
    }

    /**
     * @param {KeyframePropertyCollection} collection
     */
    ,onConfirmNewKeyframeOrder: function (collection) {
      this.$keyframesList.children().detach();

      collection.each(function (model) {
        var keyframeFormComponent = _.find(this.keyframeFormComponents,
            function (keyframeFormComponent) {
          return keyframeFormComponent.view.model === model;
        });

        this.$keyframesList.append(keyframeFormComponent.view.el);
      }, this);
    }
  });

  return KeyframesPanelComponentView;
});
