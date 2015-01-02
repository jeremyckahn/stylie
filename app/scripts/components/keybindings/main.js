define([

  'lateralus'
  ,'keydrown'

], function (

  Lateralus
  ,kd

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeybindingsComponent = Base.extend({
    name: 'keybindings'

    ,initialize: function () {
      kd.run(function () {
        kd.tick();
      });

      kd.C.press(
        this.requestEvent.bind(this, 'userRequestToggleControlPanel'));
    }

    /**
     * @param {string} eventName
     */
    ,requestEvent: function (eventName) {
      if (document.activeElement !== document.body) {
        return;
      }

      this.emit(eventName);
    }
  });

  return KeybindingsComponent;
});
