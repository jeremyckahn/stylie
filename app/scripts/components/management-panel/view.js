define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

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
          this.$loadLocalSelector.val(opt_selectedAnimation);
        }
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'keydown .save-input': function (evt) {
        if (evt.which === 13) { // enter
          this.$saveLocalButton.click();
        }
      }

      ,'click .save-local': function () {
        var newAnimatioName = this.$saveLocalInput.val();
        this.emit('userRequestSaveCurrentAnimation', newAnimatioName);
        this.$loadLocalSelector.val(newAnimatioName);
      }

      ,'click .load-local': function () {
        var currentlySelectedAnimation = this.$loadLocalSelector.val();
        this.$saveLocalInput.val(currentlySelectedAnimation);

        if (currentlySelectedAnimation) {
          this.emit('userRequestLoadAnimation', currentlySelectedAnimation);
        }
      }

      ,'click .delete': function () {
        var currentlySelectedAnimation = this.$loadLocalSelector.val();

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
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        isUserLoggedIn: this.lateralus.isUserLoggedIn()
      });

      return renderData;
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

      this.$loadLocalSelector
        .empty()
        .append($options);
    }
  });

  return ManagementPanelComponentView;
});
