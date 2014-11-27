define([

  'lateralus'

  ,'rekapi'

], function (

  Lateralus

  ,Rekapi

) {
  'use strict';

  var RekapiComponent = Lateralus.Component.extend({
    name: 'rekapi'

    ,initialize: function () {
      this.rekapi = new Rekapi();

      this.listenTo(
        this.lateralus
        ,'requestNewKeyframe'
        ,this.onRequestNewKeyframe.bind(this)
      );
    }

    ,onRequestNewKeyframe: function () {
    }
  });

  return RekapiComponent;
});
