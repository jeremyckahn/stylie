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
    ,ESC: ['userRequestCloseModal', 'userRequestDeselectAllKeyframes']
    ,SHIFT: 'userRequestEnableKeyframeSelection'
    ,SPACE: 'userRequestTogglePreviewPlayback'
  };

  var UP_EVENT_KEY_MAP = {
    SHIFT: 'userRequestDisableKeyframeSelection'
  };

  var KeybindingsComponent = Base.extend({
    name: 'keybindings'

    ,initialize: function () {
      this.bindEventMapToKeyEvents('press', PRESS_EVENT_KEY_MAP);
      this.bindEventMapToKeyEvents('up', UP_EVENT_KEY_MAP);
    }

    /**
     * @param {string} keyEventName
     * @param {Object.<string>} map
     */
    ,bindEventMapToKeyEvents: function (keyEventName, map) {
      _.each(map, function (stylieEventNames, keyName) {
        kd[keyName][keyEventName](
          this.requestEvent.bind(this, stylieEventNames));
      }, this);
    }

    /**
     * @param {string|Array.<string>} eventNames
     */
    ,requestEvent: function (eventNames) {
      var activeNodeName = document.activeElement.nodeName.toLowerCase();

      if (_.contains(INPUT_ELEMENTS, activeNodeName)) {
        return;
      }

      eventNames = _.isArray(eventNames) ? eventNames : [eventNames];

      eventNames.forEach(function (eventName) {
        this.emit(eventName);
      }.bind(this));
    }
  });

  return KeybindingsComponent;
});
