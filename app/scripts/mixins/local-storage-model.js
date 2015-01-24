define([

], function (

) {
  'use strict';

  var localStorage = window.localStorage;
  var localStorageMixin = {};
  var silentOptionsObject = { silent: true };

  localStorageMixin.initialize = function () {
    if (this.doesLocalDataExist()) {
      this.loadFromLocalStorage();
    } else {
      this.saveToLocalStorage();
    }

    this.on('change', this.onChange.bind(this));
  };

  localStorageMixin.onChange = function () {
    this.saveToLocalStorage();
  };

  localStorageMixin.doesLocalDataExist = function () {
    /**
     * @property localStorageId
     * @type {string}
     */
    return !!localStorage[this.localStorageId];
  };

  localStorageMixin.saveToLocalStorage = function () {
     localStorage[this.localStorageId] = JSON.stringify(this.toJSON());
  };

  localStorageMixin.loadFromLocalStorage = function () {
    this.clear(silentOptionsObject);
    this.set(JSON.parse(localStorage[this.localStorageId]));
  };

  return localStorageMixin;
});
