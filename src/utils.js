define([

  'underscore'

], function (

  _

) {

  return {

    'noop': function () {
      // NOOP!
    }

    ,'pxToNumber': function (px) {
      return parseInt(px, 10);
    }

    ,'trimString': function (str) {
      return str.replace(/^\s*|\s*$/g, '');
    }

    ,'getQueryParams': function () {
      var queryString = window.location.search.slice(1);
      var pairs = queryString.split('&');
      var params = {};

      _.each(pairs, function (pair) {
        var splitPair = pair.split('=');
        params[splitPair[0]] = splitPair[1];
      });

      return params;
    }
  };

});
