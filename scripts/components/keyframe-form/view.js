import $ from 'jquery';
import _ from 'underscore';
import Lateralus from 'lateralus';
import template from 'text!./template.mustache';
import CurveSelectorComponent from 'aenima/components/curve-selector/main';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const PROPERTY_RENDER_LIST = [
  { name: 'x', displayName: 'x' },
  { name: 'y', displayName: 'y' },
  { name: 'scale', displayName: 's' },
  { name: 'rotationX', displayName: 'rX' },
  { name: 'rotationY', displayName: 'rY' },
  { name: 'rotationZ', displayName: 'rZ' },
];

const INVALID_CLASS = 'invalid';
const EDITING_CLASS = 'editing';

const KeyframeFormComponentView = Base.extend({
  template: template,

  tagName: 'li',

  lateralusEvents: {
    disableMillisecondEditing: function() {
      this.disableMillisecondEditing();
    },
  },

  modelEvents: {
    /**
     * @param {KeyframePropertyModel} model
     * @param {Object} options
     * @param {boolean} options.changedByFormView
     */
    change: function(model, options) {
      if (!options.changedByFormView) {
        this.render();
      }
    },

    /**
     * @param {KeyframePropertyModel} model
     * @param {Error} error
     */
    invalid: function(model, error) {
      const invalidFields = JSON.parse(error.message.split('|')[1]);

      invalidFields.forEach(function(invalidField) {
        this['$' + invalidField].parent('label').addClass(INVALID_CLASS);
      }, this);
    },

    remove: function() {
      this.component.dispose();
    },

    /**
     * @param {KeyframePropertyModel} model
     * @param {boolean} isSelected
     */
    'change:isSelected': function(model, isSelected) {
      this.$el[isSelected ? 'addClass' : 'removeClass']('selected');
    },
  },

  events: {
    /**
     * @param {jQuery.Event} evt
     */
    'change .curve': function(evt) {
      this.emit('requestRecordUndoState');
      const $target = $(evt.target);
      const property = $target.data('property');
      this.model.set('easing_' + property, $target.val());
    },

    /**
     * @param {jQuery.Event} evt
     */
    'keydown input[type=number]': function(evt) {
      // Force these keys to blur the input.  Escape *should* blur a number
      // input (but doesn't by default for whatever reason), and Enter seems
      // to trigger a click on the "delete keyframe" button (????) instead of
      // triggering a blur or change event on the number input itself.
      if (
        evt.keyCode === 13 || // enter
        evt.keyCode === 27
      ) {
        // escape
        const $target = $(evt.target);
        $target.blur().change();
      }
    },

    'change .property input[type=number]': function() {
      this.updateModelFromForm();
    },

    'click .millisecond-input-container': function() {
      this.emit('disableMillisecondEditing');
      this.enableMillisecondEditing();

      // For whatever reason, the .focus() call only works in Firefox when
      // delayed by 16 milliseconds.
      //
      // Ugh.
      _.delay(
        () => {
          this.$millisecond.focus();
        },
        16
      );
    },

    /**
     * @param {jQuery.Event} evt
     */
    'keydown input.millisecond': function(evt) {
      if (evt.keyCode !== 13) {
        // enter
        return;
      }

      this.$millisecond.blur();
    },

    'focus input': function() {
      this.emit('requestRecordUndoState');
      this.emit('userRequestDeselectAllKeyframes');
      this.model.set('isSelected', true);
    },

    'blur input.millisecond': function() {
      this.saveMillisecondToModel();
      this.disableMillisecondEditing();
      this.emit('millisecondEditingEnd');
      this.emit('userRequestDeselectAllKeyframes');
    },

    'click .delete': function() {
      this.emit('requestRecordUndoState');
      const model = this.model;
      const collection = model.collection;

      // Defer the remove call to the next thread so that the "submit" event
      // is properly caught and handled by this view.
      _.defer(collection.remove.bind(collection, model, { dispose: true }));
    },

    /**
     * @param {jQuery.Event} evt
     */
    'submit form': function(evt) {
      evt.preventDefault();
    },
  },

  /**
   * @param {Object} options See http://backbonejs.org/#View-constructor
   * @param {KeyframePropertyModel} options.model
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);

    // Select the correct easing curve for each property, according to
    // this.model
    PROPERTY_RENDER_LIST.forEach(function(propertyObject) {
      const name = propertyObject.name;
      const $select = this['$' + name + 'Select'];

      if ($select) {
        this.addSubview(CurveSelectorComponent.View, {
          el: $select,
        });

        $select.val(this.model.get('easing_' + name));
      }
    }, this);
  },

  updateModelFromForm: function() {
    const setObject = {};

    const propertyList = PROPERTY_RENDER_LIST.concat([{ name: 'millisecond' }]);

    propertyList.forEach(function(propertyObject) {
      const $propertyField = this['$' + propertyObject.name];
      $propertyField.parent('label').removeClass(INVALID_CLASS);

      const input = $propertyField[0];

      setObject[propertyObject.name] = input.validity.valid
        ? input.valueAsNumber
        : NaN;
    }, this);

    this.model.set(setObject, {
      validate: true,
      changedByFormView: true,
    });
  },

  getTemplateRenderData: function() {
    const renderData = baseProto.getTemplateRenderData.apply(this, arguments);

    const isFirstKeyframe = this.model.get('millisecond') === 0;

    return _.extend(renderData, {
      properties: PROPERTY_RENDER_LIST.map(propertyObject => {
        const name = propertyObject.name;

        return {
          name: name,
          value: renderData[name],
          displayName: propertyObject.displayName,
        };
      }),

      canChangeEasingCurve: !isFirstKeyframe,

      canDelete: !isFirstKeyframe,
    });
  },

  render: function() {
    PROPERTY_RENDER_LIST.forEach(function(propertyObject) {
      const propertyName = propertyObject.name;
      this['$' + propertyName].val(this.model.get(propertyName));
    }, this);
  },

  enableMillisecondEditing: function() {
    if (
      this.model.get('millisecond') === 0 ||
      this.$millisecondInputContainer.hasClass(EDITING_CLASS)
    ) {
      return;
    }

    this.$millisecondInputContainer.addClass(EDITING_CLASS);
  },

  disableMillisecondEditing: function() {
    this.$millisecondInputContainer.removeClass(EDITING_CLASS);
    this.$millisecond.parent('label').removeClass(INVALID_CLASS);
  },

  saveMillisecondToModel: function() {
    this.model.set('millisecond', +this.$millisecond.val(), {
      validate: true,
    });

    const validatedMillisecond = this.model.get('millisecond');
    this.$millisecond.val(validatedMillisecond);
    this.$millisecondDisplay.text(validatedMillisecond);
  },
});

export default KeyframeFormComponentView;
