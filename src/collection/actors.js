define([

  'underscore'
  ,'backbone'

  ,'src/app'
  ,'src/constants'
  ,'src/model/actor'

], function (

  _
  ,Backbone

  ,app
  ,constant
  ,ActorModel

) {

  return Backbone.Collection.extend({

    'model': ActorModel

    ,'getCurrent': function () {
      return this.at(0);
    }

    // This is pretty slow, don't call it too often.
    ,'syncFromAppRekapi': function () {
      this.reset();

      _.each(app.rekapi.getAllActors(), function (actor) {
        this.add(new this.model({'actor': actor}));
      }, this);
    }

  });
});
