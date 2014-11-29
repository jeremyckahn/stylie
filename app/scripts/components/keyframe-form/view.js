define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

) {
  'use strict';

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

  var KeyframeFormComponentView = Lateralus.Component.View.extend({
    template: template

    ,tagName: 'li'

    ,events: {
      'change .curve': 'onChangeCurve'
      ,'keyup input[type=text]': 'onKeyupTextInput'
      ,'click .millisecond-input-container': 'onClickMillisecondInputContainer'
      ,'keydown input.millisecond': 'onKeydownMillisecondInput'
      ,'blur input.millisecond': 'onBlurMillisecondInput'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);

      this.listenTo(this.model, 'invalid', this.onModelInvalid.bind(this));

      // Select the correct easing curve for each property, according to
      // this.model
      PROPERTY_RENDER_LIST.forEach(function (propertyObject) {
        var name = propertyObject.name;
        var $select = this['$' + name + 'Select'];

        if ($select) {
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

    /**
     * @param {jQuery.Event} evt
     */
    ,onChangeCurve: function (evt) {
      var $target = $(evt.target);
      var property = $target.data('property');
      this.model.set('easing_' + property, $target.val());
    }

    ,onKeyupTextInput: function () {
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

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      return _.extend(renderData, {
        properties: PROPERTY_RENDER_LIST.map(function (propertyObject) {
            var name = propertyObject.name;

            return {
              name: name
              ,value: renderData[name]
              ,displayName: propertyObject.displayName
            };
          })
        ,curves: Object.keys(Tweenable.prototype.formula)

        ,canChangeEasingCurve: this.model.get('millisecond') !== 0
      });
    }

    ,enableMillisecondEditing: function () {
      this.$millisecondInputContainer.addClass(EDITING_CLASS);
    }

    ,disableMillisecondEditing: function () {
      this.$millisecondInputContainer.removeClass(EDITING_CLASS);
    }

    ,saveMillisecondToModel: function () {
      this.$millisecond.removeClass(INVALID_CLASS);
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
