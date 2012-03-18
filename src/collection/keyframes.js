define(['exports'], function (keyframes) {
  keyframes.collection = Backbone.Collection.extend({

    'initialize': function () {

    }

    ,'first': function () {
      return this.at(0);
    }

    ,'last': function () {
      return this.at(this.length - 1);
    }

  });
});
