import _ from 'underscore';
import Lateralus from 'lateralus';
import kd from 'keydrown';
import LateralusMixins from 'aenima/mixins/lateralus';
import ShiftyComponent from 'aenima/components/shifty/main';
import RekapiComponent from './components/rekapi/main';
import KeybindingsComponent from './components/keybindings/main';
import ContainerComponent from './components/container/main';
import StylieModel from './model';
import DataAdapter from 'aenima/data-adapter';
import constant from './constant';

/**
 * @param {Element} el
 * @param {Object} [options]
 * @param {boolean} [options.isEmbedded]
 * @param {string} [options.embeddedImgRoot]
 * @extends {Lateralus}
 * @constuctor
 */
const Stylie = Lateralus.beget(
  function(el, options) {
    this.options = _.clone(options || {});

    Lateralus.apply(this, arguments);

    this.hasInitialized = false;

    this.dataAdapter = new DataAdapter({
      apiRoot: constant.API_ROOT,
    });

    kd.run(kd.tick);

    this.initHacks();

    this.shiftyComponent = this.addComponent(ShiftyComponent);
    this.rekapiComponent = this.addComponent(RekapiComponent);
    this.keybindingsComponent = this.addComponent(KeybindingsComponent);
    this.containerComponent = this.addComponent(ContainerComponent);
    _.defer(this.deferredInitialize.bind(this));
  },
  {
    Model: StylieModel,
  }
);

const fn = Stylie.prototype;

fn.deferredInitialize = function() {
  if (!this.model.get('isEmbedded')) {
    this.shiftyComponent.addNewCurve();
  }

  const savedAnimations = this.model.get('savedAnimations');
  const transientAnimation = savedAnimations[constant.TRANSIENT_ANIMATION_NAME];

  if (transientAnimation) {
    this.loadAnimation(constant.TRANSIENT_ANIMATION_NAME);
  } else {
    this.createDefaultAnimation();
  }

  this.rekapiComponent.rekapi.play();

  if (this.getQueryParam('pause')) {
    this.rekapiComponent.rekapi.pause();
  }

  // Necessary for keeping the UI in sync after startup.
  this.saveCurrentAnimationAs(constant.TRANSIENT_ANIMATION_NAME);

  this.emit('savedAnimationListUpdated', this.getSavedAnimationDisplayList());

  this.hasInitialized = true;
};

const queryParams = (function() {
  const queryString = location.search.slice(1);
  const stringChunks = queryString.split('&');

  const accumulator = {};
  stringChunks.forEach(stringChunk => {
    const pair = stringChunk.split('=');
    accumulator[pair[0]] = pair[1];
  });

  return accumulator;
})();

/**
 * @param {string} param
 * @return {*}
 */
fn.getQueryParam = function(param) {
  return queryParams[param];
};

fn.createDefaultAnimation = function() {
  const actorModel = this.rekapiComponent.actorModel;
  actorModel.addNewKeyframe({
    state: this.getInitialKeyframeState(),
  });
  actorModel.addNewKeyframe();
};

fn.lateralusEvents = _.extend(
  {
    'rekapi:timelineModified': function() {
      if (this.hasInitialized) {
        this.saveCurrentAnimationAs(constant.TRANSIENT_ANIMATION_NAME);
      }
    },

    /**
     * @param {string} animationName
     */
    userRequestSaveCurrentAnimation: function(animationName) {
      this.saveCurrentAnimationAs(animationName);
    },

    /**
     * @param {string} animationName
     */
    userRequestLoadAnimation: function(animationName) {
      this.loadAnimation(animationName);
    },

    /**
     * @param {string} animationName
     */
    userRequestDeleteAnimation: function(animationName) {
      this.deleteAnimation(animationName);
    },

    userRequestResetAnimation: function() {
      this.emit('requestRecordUndoState');
      this.rekapiComponent.clearCurrentAnimation();
      this.createDefaultAnimation();
    },

    userRequestToggleRotationEditMode: function() {
      this.model.set(
        'isRotationModeEnabled',
        !this.model.get('isRotationModeEnabled')
      );
    },
  },
  LateralusMixins.lateralusEvents
);

_.extend(fn, LateralusMixins.fn);

fn.initHacks = function() {
  const hasSafari = navigator.userAgent.match(/safari/i);
  const hasChrome = navigator.userAgent.match(/chrome/i);
  const isFirefox = navigator.userAgent.match(/firefox/i);

  if (hasSafari && !hasChrome) {
    this.$el.addClass('safari');
  } else if (hasChrome) {
    this.$el.addClass('chrome');
  } else if (isFirefox) {
    this.$el.addClass('firefox');
  }
};

/**
 * @return {Object}
 */
fn.getInitialKeyframeState = function() {
  return {
    x: 50,
    y: this.containerComponent.view.$el.height() / 2,
  };
};

/**
 * @return {Array.<string>}
 */
fn.getSavedAnimationDisplayList = function() {
  const rawList = this.model.get('savedAnimations');
  return Object.keys(_.omit(rawList, constant.TRANSIENT_ANIMATION_NAME));
};

/**
 * @param {string} animationName
 */
fn.saveCurrentAnimationAs = function(animationName) {
  const savedAnimations = this.model.get('savedAnimations');

  // A safe copy is needed to sever any deep object references (specifically,
  // the curves sub-object gets modified by this.loadAnimation).
  const animationCopy = JSON.parse(JSON.stringify(this.rekapiComponent.toJSON()));
  savedAnimations[animationName] = animationCopy;
  this.model.set('savedAnimations', savedAnimations);

  // Force a change event to persist the saved animations to localStorage.
  this.model.trigger('change');

  if (animationName !== constant.TRANSIENT_ANIMATION_NAME) {
    this.emit(
      'savedAnimationListUpdated',
      this.getSavedAnimationDisplayList(),
      animationName
    );
  }
};

/**
 * @param {string} animationName
 */
fn.loadAnimation = function(animationName) {
  const animationData = this.model.get('savedAnimations')[animationName];
  this.rekapiComponent.fromJSON(animationData);
};

/**
 * @param {string} animationName
 */
fn.deleteAnimation = function(animationName) {
  const savedAnimations = this.model.get('savedAnimations');
  this.model.set('savedAnimations', _.omit(savedAnimations, animationName));

  // Force a change event to persist the animation list to localStorage.
  this.model.trigger('change');

  this.emit('savedAnimationListUpdated', this.getSavedAnimationDisplayList());
};

/**
 * @return {Object}
 */
fn.exportTimelineForMantra = function() {
  return this.rekapiComponent.exportTimelineForMantra();
};

export default Stylie;
