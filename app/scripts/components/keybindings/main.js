define([

  'underscore'
  ,'lateralus'
  ,'keydrown'

  ,'aenima.component.keybindings'

], function (

  _
  ,Lateralus
  ,kd

  ,AEnimaKeybindings

) {
  'use strict';

  var Base = AEnimaKeybindings;

  var KeybindingsComponent = Base.extend({
    name: 'keybindings'

    /**
     * @override
     */
    ,keyPressEventMap: {
      C: 'userRequestToggleControlPanel'
      ,H: 'userRequestToggleHelpModal'
      ,K: 'userRequestNewKeyframe'
      ,P: 'userRequestUpdateCenteringSettingViaKeybinding'
      ,R: 'userRequestToggleRotationEditMode'
      ,T: 'userRequestToggleScrubber'
      ,ESC: ['userRequestCloseModal', 'userRequestDeselectAllKeyframes']
      ,SHIFT: 'userRequestEnableKeyframeSelection'
      ,SPACE: 'userRequestTogglePreviewPlayback'
    }

    /**
     * @override
     */
    ,keyUpEventMap: {
      SHIFT: 'userRequestDisableKeyframeSelection'
    }

    /**
     * @override
     */
    ,metaKeyPressEventMap: {
      A: 'userRequestSelectAllKeyframes'
    }
  });

  return KeybindingsComponent;
});
