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
       * @param {string=} opt_selectedAnimation
       */
      savedAnimationListUpdated: function (newList, opt_selectedAnimation) {
        this.updateSavedAnimationList(newList);

        if (opt_selectedAnimation) {
          this.$loadSelector.val(opt_selectedAnimation);
        }
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'keydown .save-input': function (evt) {
        if (evt.which === 13) { // enter
          this.$saveButton.click();
        }
      }

      ,'click .save': function () {
        var newAnimatioName = this.$saveInput.val();
        this.emit('userRequestSaveCurrentAnimation', newAnimatioName);
        this.$loadSelector.val(newAnimatioName);
      }

      ,'click .load': function () {
        var currentlySelectedAnimation = this.$loadSelector.val();
        this.$saveInput.val(currentlySelectedAnimation);

        if (currentlySelectedAnimation) {
          this.emit('userRequestLoadAnimation', currentlySelectedAnimation);
        }
      }

      ,'click .delete': function () {
        var currentlySelectedAnimation = this.$loadSelector.val();

        if (currentlySelectedAnimation) {
          this.emit('userRequestDeleteAnimation', currentlySelectedAnimation);
        }
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
        option.innerHTML = option.value = animationName;
        $options.push(option);
      });

      this.$loadSelector
        .empty()
        .append($options);
    }
  });

  return ManagementPanelComponentView;
});
