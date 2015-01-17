define([

  'underscore'
  ,'lateralus'
  ,'rekapi'

], function (

  _
  ,Lateralus
  ,Rekapi

) {
  'use strict';

  var Base = Lateralus.Component.Model;


  var ActorModel = Base.extend({
    defaults: {
    }

    /**
     * @param {Object} attributes
     * @param {Object} options
     *   @param {RekapiComponent} rekapiComponent
     *   @param {RekapiActor} actor
     */
    ,initialize: function (attributes, options) {
      this.rekapiComponent = options.rekapiComponent;
      this.actor = options.actor;
    }
  });

  // Proxy all Rekapi.Actor.prototype methods through ActorModel.
  _.each(Rekapi.Actor.prototype, function (fn, fnName) {
    var proxiedFn = function () {
      return fn.apply(this.actor, arguments);
    };

    proxiedFn.displayName = 'proxied-' + fnName;
    ActorModel.prototype[fnName] = proxiedFn;
  });

  return ActorModel;
});
