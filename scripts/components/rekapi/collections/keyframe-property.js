import Backbone from 'backbone';
import Lateralus from 'lateralus';
import AEnimaRekapiComponent from 'aenima/components/rekapi/main';
import KeyframePropertyModel from '../models/keyframe-property';

var Base = AEnimaRekapiComponent.KeyframePropertyCollection;
var baseProto = Base.prototype;

var KeyframePropertyCollection = Base.extend({
  model: KeyframePropertyModel,

  lateralusEvents: {
    /**
     * @param {boolean} isCentered
     */
    userRequestUpdateCenteringSetting: function(isCentered) {
      this.setCenteringRules(isCentered);
    },
  },

  initialize: function() {
    baseProto.initialize.apply(this, arguments);
    this.setCenteringRules(this.lateralus.model.getUi('centerToPath'));
  },

  /**
   * @param {boolean} isCentered
   */
  setCenteringRules: function(isCentered) {
    this.invoke('set', 'isCentered', isCentered);
  },
});

export default KeyframePropertyCollection;
