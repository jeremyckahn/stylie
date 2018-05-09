import _ from 'underscore';
import Lateralus from 'lateralus';
import kd from 'keydrown';
import AEnimaKeybindings from 'aenima/components/keybindings/main';

var Base = AEnimaKeybindings;

var KeybindingsComponent = Base.extend({
  name: 'stylie-keybindings',

  /**
   * @override
   */
  keyPressEventMap: {
    C: 'userRequestToggleControlPanel',
    H: 'userRequestToggleHelpModal',
    K: 'userRequestNewKeyframe',
    P: 'userRequestUpdateCenteringSettingViaKeybinding',
    R: 'userRequestToggleRotationEditMode',
    T: 'userRequestToggleScrubber',
    ESC: ['userRequestCloseModal', 'userRequestDeselectAllKeyframes'],
    SHIFT: 'userRequestEnableKeyframeSelection',
    SPACE: 'userRequestTogglePreviewPlayback',
  },

  /**
   * @override
   */
  keyUpEventMap: {
    SHIFT: 'userRequestDisableKeyframeSelection',
  },

  /**
   * @override
   */
  metaKeyPressEventMap: {
    A: 'userRequestSelectAllKeyframes',
    Z: 'userRequestUndo',
  },
});

export default KeybindingsComponent;
