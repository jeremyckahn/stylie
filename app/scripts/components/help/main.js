define([

  'aenima.component.modal'

  ,'./view'
  ,'text!./template.mustache'

], function (

  ModalComponent

  ,View
  ,template

) {
  'use strict';

  var Base = ModalComponent;

  var HelpComponent = Base.extend({
    name: 'help'
    ,View: View
    ,template: template
  });

  return HelpComponent;
});
