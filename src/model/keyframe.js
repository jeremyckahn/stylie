define(['exports'], function (keyframe) {
  keyframe.model = Backbone.Model.extend({

    'initialize': function () {

    }

    ,'validate': function (attrs) {
      var foundNaN = false;
      _.each(attrs, function (attr) {
        if (typeof attr !== 'number') {
          foundNaN = true;
        }
      });

      if (foundNaN) {
        return 'Number is NaN';
      }
    }

    ,'getCSS': function () {
      return {
        'left': this.get('left') + 'px'
        ,'top': this.get('top') + 'px'
      };
    }

    ,'getAttrs': function () {
      return {
        'left': this.get('left')
        ,'top': this.get('top')
      };
    }

  });
});
