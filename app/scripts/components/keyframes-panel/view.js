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
      'click .add-keyframe': 'onClickAddKeyframe'
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

    ,onClickAddKeyframe: function () {
      this.emit('requestNewKeyframe');
    }

    /**
     * @param {Backbone.Model} keyframePropertyModel
     */
    ,onKeyframePropertyAdded: function (keyframePropertyModel) {
      var keyframeFormComponent = this.addComponent(KeyframeFormComponent, {
        model: keyframePropertyModel
      });

      this.keyframeFormComponents.push(keyframeFormComponent);
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
