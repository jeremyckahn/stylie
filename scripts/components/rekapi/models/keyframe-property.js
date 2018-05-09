define([
  'underscore',
  'lateralus',
  'mustache',
  'aenima/components/rekapi/main',
  'text!../templates/transform-string.mustache',
], function(
  _,
  Lateralus,
  Mustache,
  AEnimaRekapiComponent,
  transformStringTemplate
) {
  'use strict';

  var Base = AEnimaRekapiComponent.KeyframePropertyModel;

  var SCALE_UNDO_DEBOUNCE = 1000;
  var NUMBER_PROPERTIES = [
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
      userRequestDeselectAllKeyframes: function() {
        this.set('isSelected', false);
      },

      /**
       * @param  {jQuery.Event} evt
       */
      userRequestSelectAllKeyframes: function(evt) {
        evt.preventDefault();
        this.set('isSelected', true);
      },
    },

    initialize: function(attributes) {
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

    onChange: function() {
      this.updateRawKeyframeProperty();
    },

    onChangeScale: function() {
      if (this.lateralus.model.get('isRotationModeEnabled')) {
        this.emit('requestRecordUndoState');
      }
    },

    onRemove: function() {
      this.keyframeProperty.actor.removeKeyframe(this.attributes.millisecond);
    },

    /**
     * @param {string} easingString A Rekapi-style, space-delimited list of
     * easing curves.
     */
    setEasingFromString: function(easingString) {
      var easingStringChunks = easingString.split(' ');

      [
        'easing_x',
        'easing_y',
        'easing_scale',
        'easing_rotationX',
        'easing_rotationY',
        'easing_rotationZ',
      ].forEach(function(property, i) {
        var easingChunk = easingStringChunks[i];

        if (easingChunk) {
          this.attributes[property] = easingChunk;
        }
      }, this);
    },

    /**
     * @return {string}
     */
    getValue: function() {
      return Mustache.render(
        // Strip out any newlines
        transformStringTemplate.replace(/\n/g, ''),
        this.toJSON()
      );
    },

    /**
     * @return {string}
     */
    getEasing: function() {
      var attributes = this.attributes;

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
    validate: function(attributes) {
      var invalidFields = _.filter(NUMBER_PROPERTIES, function(numberProperty) {
        return isNaN(attributes[numberProperty]);
      });

      var millisecond = attributes.millisecond;

      if (
        // If the millisecond is changing
        this.attributes.millisecond !== millisecond &&
        // And millisecond is not already invalid
        !_.contains(invalidFields, 'millisecond') &&
        // And the keyframe already exists or is negative
        (this.collection.findWhere({ millisecond: millisecond }) ||
          millisecond < 0)
      ) {
        invalidFields.push('millisecond');
      }

      if (invalidFields.length) {
        return new Error(
          'Invalid KeyframePropertyModel values|' +
            JSON.stringify(invalidFields)
        );
      }
    },

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    bindToRawKeyframeProperty: function(keyframeProperty) {
      this.keyframeProperty = keyframeProperty;
    },

    updateRawKeyframeProperty: function() {
      if (!this.keyframeProperty) {
        return;
      }

      var millisecond = this.attributes.millisecond;
      var keyframeProperty = this.keyframeProperty;
      var actor = keyframeProperty.actor;

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

  return KeyframePropertyModel;
});
