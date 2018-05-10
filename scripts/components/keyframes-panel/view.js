import _ from 'underscore';
import Lateralus from 'lateralus';
import template from 'text!./template.mustache';
import KeyframeFormComponent from '../keyframe-form/main';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const KeyframesPanelComponentView = Base.extend({
  template: template,

  events: {
    'click .add-keyframe': function() {
      this.emit('userRequestNewKeyframe');
    },
  },

  /**
   * @param {KeyframePropertyCollection} collection
   */
  lateralusEvents: {
    /**
     * @param {Backbone.Model} keyframePropertyModel
     */
    keyframePropertyAdded: function(keyframePropertyModel) {
      const keyframeFormComponent = this.addComponent(KeyframeFormComponent, {
        model: keyframePropertyModel,
      });

      this.$keyframesList.append(keyframeFormComponent.view.el);
    },

    confirmNewKeyframeOrder: function(collection) {
      this.$keyframesList.children().detach();

      collection.each(function(model) {
        const keyframeFormComponent = _.find(this.component.components, component => component.view.model === model);

        this.$keyframesList.append(keyframeFormComponent.view.el);
      }, this);
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
  },
});

export default KeyframesPanelComponentView;
