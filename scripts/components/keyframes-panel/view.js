define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../keyframe-form/main'

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
     * @param {KeyframePropertyCollection} collection
     */
    ,lateralusEvents: {
      /**
       * @param {Backbone.Model} keyframePropertyModel
       */
      keyframePropertyAdded: function (keyframePropertyModel) {
        var keyframeFormComponent = this.addComponent(KeyframeFormComponent, {
          model: keyframePropertyModel
        });

        this.$keyframesList.append(keyframeFormComponent.view.el);
      }

      ,confirmNewKeyframeOrder: function (collection) {
        this.$keyframesList.children().detach();

        collection.each(function (model) {
          var keyframeFormComponent = _.find(this.component.components
              ,function (component) {
            return component.view.model === model;
          });

          this.$keyframesList.append(keyframeFormComponent.view.el);
        }, this);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframesPanelComponentView;
});
