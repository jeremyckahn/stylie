define([

  'underscore'
  ,'backbone'

  ,'src/constants'
  ,'src/model/actor'

], function (

  _
  ,Backbone

  ,constant
  ,ActorModel

) {

  return Backbone.Collection.extend({

    'model': ActorModel

    /**
     * @param {Array.<Object>} models
     * @param {Object} opts
     *   @param {Stylie} stylie
     */
    ,'initialize': function (models, opts) {
      this.stylie = opts.stylie;
      this.stylie.rekapi.on('addActor', _.bind(this.syncFromAppRekapi, this));
    }

    ,'getCurrent': function () {
      return this.at(0);
    }

    // This is pretty slow, don't call it too often.
    ,'syncFromAppRekapi': function () {
      this.reset();

      _.each(this.stylie.rekapi.getAllActors(), function (actor) {
        this.add(new this.model({'actor': actor}, { stylie: this.stylie }));
      }, this);
    }

  });
});
