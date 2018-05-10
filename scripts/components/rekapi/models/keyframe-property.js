import _ from 'underscore';
import Lateralus from 'lateralus';
import Mustache from 'mustache';
import AEnimaRekapiComponent from 'aenima/components/rekapi/main';
import transformStringTemplate from 'text!../templates/transform-string.mustache';

const Base = AEnimaRekapiComponent.KeyframePropertyModel;

const SCALE_UNDO_DEBOUNCE = 1000;
const NUMBER_PROPERTIES = [
  'millisecond',
  'x',
  'y',
  'scale',
  'rotationX',
  'rotationY',
  'rotationZ',
];

var KeyframePropertyModel = Base.extend({
  defaults: {
    millisecond: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    easing_x: 'linear',
    easing_y: 'linear',
    easing_scale: 'linear',
    easing_rotationX: 'linear',
    easing_rotationY: 'linear',
    easing_rotationZ: 'linear',
    isCentered: false,
    isSelected: false,
  },

  lateralusEvents: {
    userRequestDeselectAllKeyframes() {
      this.set('isSelected', false);
    },

    /**
     * @param  {jQuery.Event} evt
     */
    userRequestSelectAllKeyframes(evt) {
      evt.preventDefault();
      this.set('isSelected', true);
    },
  },

  initialize(attributes) {
    this.keyframeProperty = null;

    if (typeof attributes.easing === 'string') {
      this.setEasingFromString(attributes.easing);
      this.unset('easing', { silent: true });
    }

    this._previousAttributes = _.clone(this.attributes);

    this.on('change', this.onChange.bind(this));
    this.on('remove', this.onRemove.bind(this));
    this.on(
      'change:scale',
      _.debounce(this.onChangeScale.bind(this), SCALE_UNDO_DEBOUNCE, {
        leading: true,
        trailing: false,
      })
    );
  },

  onChange() {
    this.updateRawKeyframeProperty();
  },

  onChangeScale() {
    if (this.lateralus.model.get('isRotationModeEnabled')) {
      this.emit('requestRecordUndoState');
    }
  },

  onRemove() {
    this.keyframeProperty.actor.removeKeyframe(this.attributes.millisecond);
  },

  /**
   * @param {string} easingString A Rekapi-style, space-delimited list of
   * easing curves.
   */
  setEasingFromString(easingString) {
    const easingStringChunks = easingString.split(' ');

    [
      'easing_x',
      'easing_y',
      'easing_scale',
      'easing_rotationX',
      'easing_rotationY',
      'easing_rotationZ',
    ].forEach(function(property, i) {
      const easingChunk = easingStringChunks[i];

      if (easingChunk) {
        this.attributes[property] = easingChunk;
      }
    }, this);
  },

  /**
   * @return {string}
   */
  getValue() {
    return Mustache.render(
      // Strip out any newlines
      transformStringTemplate.replace(/\n/g, ''),
      this.toJSON()
    );
  },

  /**
   * @return {string}
   */
  getEasing() {
    const attributes = this.attributes;

    return [
      attributes.easing_x,
      attributes.easing_y,
      attributes.easing_scale,
      attributes.easing_rotationX,
      attributes.easing_rotationY,
      attributes.easing_rotationZ,
    ].join(' ');
  },

  /**
   * @param {Object} attributes
   * @return {Error=}
   */
  validate(attributes) {
    const invalidFields = _.filter(NUMBER_PROPERTIES, numberProperty =>
      isNaN(attributes[numberProperty])
    );

    const millisecond = attributes.millisecond;

    if (
      // If the millisecond is changing
      this.attributes.millisecond !== millisecond &&
      // And millisecond is not already invalid
      !_.contains(invalidFields, 'millisecond') &&
      // And the keyframe already exists or is negative
      (this.collection.findWhere({ millisecond }) || millisecond < 0)
    ) {
      invalidFields.push('millisecond');
    }

    if (invalidFields.length) {
      return new Error(
        `Invalid KeyframePropertyModel values|${JSON.stringify(invalidFields)}`
      );
    }
  },

  /**
   * @param {Rekapi.KeyframeProperty} keyframeProperty
   */
  bindToRawKeyframeProperty(keyframeProperty) {
    this.keyframeProperty = keyframeProperty;
  },

  updateRawKeyframeProperty() {
    if (!this.keyframeProperty) {
      return;
    }

    const millisecond = this.attributes.millisecond;
    var keyframeProperty = this.keyframeProperty;
    const actor = keyframeProperty.actor;

    if (millisecond !== keyframeProperty.millisecond) {
      actor.moveKeyframe(keyframeProperty.millisecond, millisecond);
    }

    // It is necessary to go through actor.modifyKeyframe here so that the
    // timelineModified Rekapi event fires.
    //
    // TODO: In Rekapi, make it so that KeyframeProperty#modifyWith can fire
    // this event.
    actor.modifyKeyframe(
      millisecond,
      {
        transform: this.getValue(),
      },
      {
        transform: this.getEasing(),
      }
    );
  },
});

export default KeyframePropertyModel;
