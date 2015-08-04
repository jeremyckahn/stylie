define([

  'underscore'
  ,'lateralus'
  ,'mustache'

  ,'text!../templates/transform-string.mustache'

], function (

  _
  ,Lateralus
  ,Mustache

  ,transformStringTemplate

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var NUMBER_PROPERTIES = [
    'millisecond'
    ,'x'
    ,'y'
    ,'scale'
    ,'rotationX'
    ,'rotationY'
    ,'rotationZ'
  ];

  var KeyframePropertyModel = Base.extend({
    defaults: {
      millisecond: 0
      ,x: 0
      ,y: 0
      ,scale: 1
      ,rotationX: 0
      ,rotationY: 0
      ,rotationZ: 0
      ,easing_x: 'linear'
      ,easing_y: 'linear'
      ,easing_scale: 'linear'
      ,easing_rotationX: 'linear'
      ,easing_rotationY: 'linear'
      ,easing_rotationZ: 'linear'
      ,isCentered: false
      ,isSelected: false
    }

    ,lateralusEvents: {
      userRequestDeselectAllKeyframes: function () {
        this.set('isSelected', false);
      }
    }

    ,initialize: function (attributes) {
      this.keyframeProperty = null;

      if (typeof attributes.easing === 'string') {
        this.setEasingFromString(attributes.easing);
        this.unset('easing', { silent: true });
      }

      this._previousAttributes = _.clone(this.attributes);

      this.on('change', this.onChange.bind(this));
      this.on('remove', this.onRemove.bind(this));
    }

    ,onChange: function () {
      this.updateRawKeyframeProperty();
    }

    ,onRemove: function () {
      this.keyframeProperty.actor.removeKeyframe(this.attributes.millisecond);

      // TODO: There really should be more robust support for
      // Lateralus.Component.Model cleanup.  Make a proper .dispose() method
      // for this at the Lateralus level.
      this.stopListening();
      this.destroy();
    }

    /**
     * @param {string} easingString A Rekapi-style, space-delimited list of
     * easing curves.
     */
    ,setEasingFromString: function (easingString) {
      var easingStringChunks = easingString.split(' ');

      [
       'easing_x'
      ,'easing_y'
      ,'easing_scale'
      ,'easing_rotationX'
      ,'easing_rotationY'
      ,'easing_rotationZ'
        ].forEach(function (property, i) {
          var easingChunk = easingStringChunks[i];

          if (easingChunk) {
            this.attributes[property] = easingChunk;
          }
        }, this);
    }

    /**
     * @return {string}
     */
    ,getValue: function () {
      return Mustache.render(
        // Strip out any newlines
        transformStringTemplate.replace(/\n/g,''), this.toJSON());
    }

    /**
     * @return {string}
     */
    ,getEasing: function () {
      var attributes = this.attributes;

      return [
        attributes.easing_x
        ,attributes.easing_y
        ,attributes.easing_scale
        ,attributes.easing_rotationX
        ,attributes.easing_rotationY
        ,attributes.easing_rotationZ
      ].join(' ');
    }

    /**
     * @param {Object} attributes
     * @return {Error=}
     */
    ,validate: function (attributes) {
      var invalidFields = _.filter(NUMBER_PROPERTIES,
          function (numberProperty) {
        return isNaN(attributes[numberProperty]);
      });

      var millisecond = attributes.millisecond;

      if (
        // If the millisecond is changing
        this.attributes.millisecond !== millisecond &&

        // And millisecond is not already invalid
        !_.contains(invalidFields, 'millisecond') &&

        // And the keyframe already exists or is negative
        (
          this.collection.findWhere({ millisecond: millisecond }) ||
          millisecond < 0
        )

      ) {
        invalidFields.push('millisecond');
      }

      if (invalidFields.length) {
        return new Error(
          'Invalid KeyframePropertyModel values|' +
          JSON.stringify(invalidFields));
      }
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,bindToRawKeyframeProperty: function (keyframeProperty) {
      this.keyframeProperty = keyframeProperty;
    }

    ,updateRawKeyframeProperty: function () {
      if (!this.keyframeProperty) {
        return;
      }

      var millisecond = this.attributes.millisecond;
      var keyframeProperty = this.keyframeProperty;
      var actor = keyframeProperty.actor;

      // It is necessary to go through actor.modifyKeyframe here so that the
      // timelineModified Rekapi event fires.
      //
      // TODO: In Rekapi, make it so that KeyframeProperty#modifyWith can fire
      // this event.
      actor.modifyKeyframe(millisecond, {
        transform: this.getValue()
      }, {
        transform: this.getEasing()
      });

      if (millisecond !== keyframeProperty.millisecond) {
        actor.moveKeyframe(keyframeProperty.millisecond, millisecond);
      }
    }
  });

  return KeyframePropertyModel;
});
