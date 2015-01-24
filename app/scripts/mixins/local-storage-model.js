define([

], function (

) {
  'use strict';

  var localStorage = window.localStorage;
  var localStorageMixin = {};
  var silentOptionsObject = { silent: true };

  localStorageMixin.initialize = function () {
    if (this.localStorageDataDoesExist()) {
      this.localStorageLoad();
    } else {
      this.localStorageSave();
    }

    this.on('change', onChange.bind(this));
  };

  // jshint validthis:true
  function onChange () {
    this.localStorageSave();
  }

  /**
   * @return {boolean}
   */
  localStorageMixin.localStorageDataDoesExist = function () {
    /**
     * @property localStorageId
     * @type {string}
     */
    return !!localStorage[this.localStorageId];
  };

  localStorageMixin.localStorageSave = function () {
     localStorage[this.localStorageId] = JSON.stringify(this.toJSON());
  };

  localStorageMixin.localStorageLoad = function () {
    this.clear(silentOptionsObject);
    this.set(JSON.parse(localStorage[this.localStorageId]));
  };

  return localStorageMixin;
});
