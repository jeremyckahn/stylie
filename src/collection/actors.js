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
    ,'syncFromAppKapi': function () {
      this.reset();

      _.each(app.kapi.getAllActors(), function (actor) {
        this.add(new this.model({'actor': actor}));
      }, this);
    }

  });
});
