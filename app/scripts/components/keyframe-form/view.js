define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.curve-selector'

], function (

  _
  ,Lateralus

  ,template

  ,CurveSelectorComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var PROPERTY_RENDER_LIST = [
      { name: 'x', displayName: 'x' }
      ,{ name: 'y', displayName: 'y' }
      ,{ name: 'scale', displayName: 's' }
      ,{ name: 'rotationX', displayName: 'rX' }
      ,{ name: 'rotationY', displayName: 'rY' }
      ,{ name: 'rotationZ', displayName: 'rZ' }
    ];

  var INVALID_CLASS = 'invalid';
  var EDITING_CLASS = 'editing';

  var KeyframeFormComponentView = Base.extend({
    template: template

    ,tagName: 'li'

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'change .curve': function (evt) {
        var $target = $(evt.target);
        var property = $target.data('property');
        this.model.set('easing_' + property, $target.val());
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'keydown input[type=number]': function (evt) {

        // Force these keys to blur the input.  Escape *should* blur a number
        // input (but doesn't by default for whatever reason), and Enter seems
        // to trigger a click on the "delete keyframe" button (????) instead of
        // triggering a blur or change event on the number input itself.
        if (evt.keyCode === 13 ||  // enter
            evt.keyCode === 27 ) { // escape
          var $target = $(evt.target);
          $target
            .blur()
            .change();
        }
      }

      ,'change input[type=number]': function () {
        this.updateModelFromForm();
      }

      ,'click .millisecond-input-container': function () {
        this.enableMillisecondEditing();
      }

      ,'keydown input.millisecond': function (evt) {
        if (evt.keyCode !== 13) { // enter
          return;
        }

        this.$millisecond.blur();
      }

      ,'blur input.millisecond': function () {
        this.saveMillisecondToModel();
        this.disableMillisecondEditing();
        this.emit('millisecondEditingEnd');
      }

      ,'click .delete': function () {
        // Defer the destroy call to the next thread so that the "submit" event
        // is properly caught and handled by this view.
        _.defer(this.model.destroy.bind(this.model));
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'submit form': function (evt) {
        evt.preventDefault();
      }
    }

    /**
     * @param {Object} options See http://backbonejs.org/#View-constructor
     * @param {KeyframePropertyModel} options.model
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.listenTo(this.model, 'change', this.onModelChange.bind(this));
      this.listenTo(this.model, 'invalid', this.onModelInvalid.bind(this));
      this.listenTo(this.model, 'destroy', this.onModelDestroy.bind(this));

      // Select the correct easing curve for each property, according to
      // this.model
      PROPERTY_RENDER_LIST.forEach(function (propertyObject) {
        var name = propertyObject.name;
        var $select = this['$' + name + 'Select'];

        if ($select) {
          this.addSubview(CurveSelectorComponent.View, {
            el: $select
          });

          $select.val(this.model.get('easing_' + name));
        }
      }, this);
    }

    /**
     * @param {KeyframePropertyModel} model
     * @param {Object} options
     * @param {boolean} options.changedByFormView
     */
    ,onModelChange: function (model, options) {
      if (!options.changedByFormView) {
        this.render();
      }
    }

    /**
     * @param {KeyframePropertyModel} model
     * @param {Error} error
     */
    ,onModelInvalid: function (model, error) {
      var invalidFields = JSON.parse(error.message.split('|')[1]);

      invalidFields.forEach(function (invalidField) {
        this['$' + invalidField].addClass(INVALID_CLASS);
      }, this);
    }

    ,onModelDestroy: function () {
      this.remove();
    }

    ,updateModelFromForm: function () {
      var setObject = {};

      var propertyList =
        PROPERTY_RENDER_LIST.concat([{ name: 'millisecond' }]);

      propertyList.forEach(function (propertyObject) {
        var $propertyField = this['$' + propertyObject.name];
        $propertyField.removeClass(INVALID_CLASS);

        var input = $propertyField[0];

        setObject[propertyObject.name] =
          input.validity.valid ? input.valueAsNumber : NaN;
      }, this);

      this.model.set(setObject, {
        validate: true
        ,changedByFormView: true
      });
    }

    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      var isFirstKeyframe = this.model.get('millisecond') === 0;

      return _.extend(renderData, {
        properties: PROPERTY_RENDER_LIST.map(function (propertyObject) {
            var name = propertyObject.name;

            return {
              name: name
              ,value: renderData[name]
              ,displayName: propertyObject.displayName
            };
          })

        ,canChangeEasingCurve: !isFirstKeyframe

        ,canDelete: !isFirstKeyframe
      });
    }

    ,render: function () {
      PROPERTY_RENDER_LIST.forEach(function (propertyObject) {
        var propertyName = propertyObject.name;
        this['$' + propertyName].val(this.model.get(propertyName));
      }, this);
    }

    ,enableMillisecondEditing: function () {
      if (this.model.get('millisecond') === 0 ||
          this.$millisecondInputContainer.hasClass(EDITING_CLASS)) {
        return;
      }

      this.$millisecondInputContainer.addClass(EDITING_CLASS);
    }

    ,disableMillisecondEditing: function () {
      this.$millisecondInputContainer.removeClass(EDITING_CLASS);
      this.$millisecond.removeClass(INVALID_CLASS);
    }

    ,saveMillisecondToModel: function () {
      this.model.set(
        'millisecond'
        ,+this.$millisecond.val()
        ,{ validate: true }
      );

      var validatedMillisecond = this.model.get('millisecond');
      this.$millisecond.val(validatedMillisecond);
      this.$millisecondDisplay.text(validatedMillisecond);
    }
  });

  return KeyframeFormComponentView;
});
