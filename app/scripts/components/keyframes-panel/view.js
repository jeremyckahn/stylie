define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

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
    }

    ,onClickAddKeyframe: function () {
      this.emit('requestNewKeyframe');
    }
  });

  return KeyframesPanelComponentView;
});
