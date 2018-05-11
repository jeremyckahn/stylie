import _ from 'underscore';
import Lateralus from 'lateralus';
import PersistedModel from 'aenima/models/persisted-model';

const Base = PersistedModel;
const baseProto = Base.prototype;

const INITIAL_STATE = {
  savedAnimations: {},

  // TODO: Move isRotationModeEnabled and isLoadingTimeline to the .set in
  // initialize?
  isRotationModeEnabled: false,
  isLoadingTimeline: false,
  ui: {
    exportOrientation: 'first-keyframe',
    focusedControlPanelTab: '',
    showPath: true,
    centerToPath: true,
    cssSize: 30,
    selectedVendors: ['w3'],
  },
};

const StylieModel = Base.extend({
  localStorageId: 'stylieData',

  initialize() {
    baseProto.initialize.apply(this, arguments);

    const isEmbedded = this.lateralus.getQueryParam('isEmbedded');

    if (isEmbedded) {
      this.localStorageSave = _.noop;
    }

    if (this.keys().length && !isEmbedded) {
      this.retrofitUiData();
    } else {
      this.setInitialState();
    }

    this.set(
      _.extend(
        {
          // Override whatever is in localStorage for this property, it's weird
          // to start with Rotation Mode enabled
          isRotationModeEnabled: false,

          env: window.env || {},

          hasApi: this.lateralus.getQueryParam('hasApi'),
          isEmbedded,
          embeddedImgRoot: './',
        },
        this.lateralus.options
      )
    );
  },

  setInitialState() {
    // Call .set() directly instead of leveraging Backbone.Model#defaults to
    // prevent shared prototype references.
    this.set(INITIAL_STATE);
  },

  /**
   * Some ui keys were added at different times in project history, so ui
   * data must be partially, retroactively re-initialized to prevent corrupt
   * UI state.
   */
  retrofitUiData() {
    _.defaults(this.attributes.ui, INITIAL_STATE.ui);
  },
});

export default StylieModel;
