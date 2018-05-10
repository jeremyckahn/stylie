import Backbone from 'backbone';
import Lateralus from 'lateralus';
import AEnimaRekapiComponent from 'aenima/components/rekapi/main';
import KeyframePropertyModel from '../models/keyframe-property';

const Base = AEnimaRekapiComponent.KeyframePropertyCollection;
const baseProto = Base.prototype;

var KeyframePropertyCollection = Base.extend({
  model: KeyframePropertyModel,

  lateralusEvents: {
    /**
     * @param {boolean} isCentered
     */
    userRequestUpdateCenteringSetting(isCentered) {
      this.setCenteringRules(isCentered);
    },
  },

  initialize() {
    baseProto.initialize.apply(this, arguments);
    this.setCenteringRules(this.lateralus.model.getUi('centerToPath'));
  },

  /**
   * @param {boolean} isCentered
   */
  setCenteringRules(isCentered) {
    this.invoke('set', 'isCentered', isCentered);
  },
});

export default KeyframePropertyCollection;
