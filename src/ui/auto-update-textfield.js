define([

  'underscore'
  ,'backbone'

  ,'src/utils'

], function (

  _
  ,Backbone

  ,util

) {

  return Backbone.View.extend({

    'events': {
      'keyup': 'onKeyup'
      ,'keydown': 'onKeydown'
      ,'blur': 'onBlur'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
    }

    ,'onKeyup': function (evt) {
      var val = this.$el.val();
      this.onValReenter(val);
    }

    ,'onKeydown': function (evt) {
      var which = +evt.which;

      if (which === 38) { // up
        this.onArrowUp(evt);
      } else if (which === 40) { // down
        this.onArrowDown(evt);
      } else if (which === 13) { // enter
        this.onEnterDown(evt);
      } else if (which === 27) { // escape
        this.onEscapeDown(evt);
      }
    }

    ,'tearDown': function () {
      this.remove();
      util.deleteAllProperties(this);
    }

    ,'onEscapeDown': function (evt) {
      this.$el.trigger('blur');
    }

    // Bindable events

    ,'onBlur': util.noop // function(evt)

    ,'onArrowUp': util.noop // function (evt)

    ,'onArrowDown': util.noop // function (evt)

    ,'onEnterDown': util.noop // function (evt)

    ,'onValReenter': util.noop // function (val)

  });

});
