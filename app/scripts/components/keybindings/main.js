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

  var KeybindingsComponent = Base.extend({
    name: 'keybindings'

    ,initialize: function () {
      kd.run(function () {
        kd.tick();
      });

      kd.C.press(
        this.requestEvent.bind(this, 'userRequestToggleControlPanel'));
      kd.SHIFT.press(
        this.requestEvent.bind(this, 'userRequestStartRotationEditMode'));
      kd.SHIFT.up(
        this.requestEvent.bind(this, 'userRequestEndRotationEditMode'));
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
