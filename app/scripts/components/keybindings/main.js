define([

  'underscore'
  ,'lateralus'
  ,'keydrown'

], function (

  _
  ,Lateralus
  ,kd

) {
  'use strict';

  var Base = Lateralus.Component;

  // If the user is focused on any of these types of elements, global
  // keybinding handlers are blocked.
  var INPUT_ELEMENTS = [
    'select'
    ,'input'
    ,'textarea'
  ];

  var PRESS_EVENT_KEY_MAP = {
    C: 'userRequestToggleControlPanel'
    ,H: 'userRequestToggleHelpModal'
    ,K: 'userRequestNewKeyframe'
    ,P: 'userRequestUpdateCenteringSettingViaKeybinding'
    ,R: 'userRequestToggleRotationEditMode'
    ,T: 'userRequestToggleScrubber'
    ,ESC: 'userRequestCloseModal'
    ,SPACE: 'userRequestTogglePreviewPlayback'
  };

  var UP_EVENT_KEY_MAP = {
  };

  var KeybindingsComponent = Base.extend({
    name: 'keybindings'

    ,initialize: function () {

      this.bindEventMapToKeyEvent('press', PRESS_EVENT_KEY_MAP);
      this.bindEventMapToKeyEvent('up', UP_EVENT_KEY_MAP);
    }

    /**
     * @param {string} keyEventName
     * @param {Object.<string>} map
     */
    ,bindEventMapToKeyEvent: function (keyEventName, map) {
      _.each(map, function (stylieEventName, keyName) {
        kd[keyName][keyEventName](
          this.requestEvent.bind(this, stylieEventName));
      }, this);
    }

    /**
     * @param {string} eventName
     */
    ,requestEvent: function (eventName) {
      var activeNodeName = document.activeElement.nodeName.toLowerCase();

      if (_.contains(INPUT_ELEMENTS, activeNodeName)) {
        return;
      }

      this.emit(eventName);
    }
  });

  return KeybindingsComponent;
});
