define([

  'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.keyframe-form'

], function (

  Lateralus

  ,template

  ,KeyframeFormComponent

) {
  'use strict';

  var KeyframesPanelComponentView = Lateralus.Component.View.extend({
    template: template

    ,events: {
      'click .add-keyframe': 'onClickAddKeyframe'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
      this.listenFor(
        'keyframePropertyAdded', this.onKeyframePropertyAdded.bind(this));
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

      this.$keyframesList.append(keyframeFormComponent.view.el);
    }
  });

  return KeyframesPanelComponentView;
});
