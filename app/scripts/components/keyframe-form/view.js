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
      'change .curve': 'onChangeCurve'
      ,'change input[type=number]': 'onChangeNumberInput'
      ,'click .millisecond-input-container': 'onClickMillisecondInputContainer'
      ,'keydown input.millisecond': 'onKeydownMillisecondInput'
      ,'blur input.millisecond': 'onBlurMillisecondInput'
      ,'click .delete': 'onClickDelete'
      ,'submit form': 'onSubmitForm'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

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

    /**
     * @param {jQuery.Event} evt
     */
    ,onChangeCurve: function (evt) {
      var $target = $(evt.target);
      var property = $target.data('property');
      this.model.set('easing_' + property, $target.val());
    }

    ,onChangeNumberInput: function () {
      var setObject = {};

      var propertyList = PROPERTY_RENDER_LIST.concat([{ name: 'millisecond' }]);

      propertyList.forEach(function (propertyObject) {
        var $propertyField = this['$' + propertyObject.name];
        $propertyField.removeClass(INVALID_CLASS);
        setObject[propertyObject.name] = +$propertyField.val();
      }, this);

      this.model.set(setObject, { validate: true });
    }

    ,onClickMillisecondInputContainer: function () {
      if (this.model.get('millisecond') === 0 ||
          this.$millisecondInputContainer.hasClass(EDITING_CLASS)) {
        return;
      }

      this.$millisecond.removeClass(EDITING_CLASS);
      this.enableMillisecondEditing();
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onKeydownMillisecondInput: function (evt) {
      if (evt.keyCode !== 13) { // enter
        return;
      }

      this.$millisecond.blur();
    }

    ,onBlurMillisecondInput: function () {
      this.saveMillisecondToModel();
      this.disableMillisecondEditing();
      this.emit('millisecondEditingEnd');
    }

    ,onClickDelete: function () {
      // Defer the destroy call to the next thread so that the "submit" event
      // is properly caught and handled by this view.
      _.defer(this.model.destroy.bind(this.model));
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onSubmitForm: function (evt) {
      evt.preventDefault();
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

    ,enableMillisecondEditing: function () {
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
