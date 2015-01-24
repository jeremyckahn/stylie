define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ManagementPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {Array.<string>} newList
       */
      savedAnimationListUpdated: function (newList) {
        this.updateSavedAnimationList(newList);
      }
    }

    ,events: {
      'click .save button': function () {
        var newAnimatioName = this.$saveInput.val();
        this.emit('userRequestSaveCurrentAnimation', newAnimatioName);
        this.$loadSelector.val(newAnimatioName);
      }

      ,'click .load button': function () {
        this.emit('userRequestLoadAnimation', this.$loadSelector.val());
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @param {Array.<string>} newList
     */
    ,updateSavedAnimationList: function (newList) {
      var $options = $();

      newList.forEach(function (animationName) {
        var option = document.createElement('option');
        option.innerText = option.value = animationName;
        $options.push(option);
      });

      this.$loadSelector
        .empty()
        .append($options);
    }
  });

  return ManagementPanelComponentView;
});
