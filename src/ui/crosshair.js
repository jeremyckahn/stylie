define(['src/app', 'src/constants', 'src/utils'],
    function (app, constant, util) {

  var $win = $(window);

  return Backbone.View.extend({

    'events': {
      'mousedown .rotation-arm': 'onClickRotationArm'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el.dragon({
        'within': this.owner.$el.parent()
        ,'dragStart': _.bind(this.dragStart, this)
        ,'dragEnd': _.bind(this.dragEnd, this)
      });

      this.$el.css('transform', 'rotate(0deg)');
      this.model.on('change', _.bind(this.render, this));
      this._isRotating = false;
      this.model.crosshairView = this;
      this.render();
    }

    ,'onClickRotationArm': function (evt) {
      this.startRotating(evt.clientX, evt.clientY);
      evt.stopPropagation();
    }

    ,'onMouseupRotatorArm': function (evt) {
      this.stopRotating();
    }

    ,'onMouseMoveRotator': function (evt) {
      this.rotateForDragDelta(evt.clientX, evt.clientY);
    }

    ,'onKeyupRotator': function (evt) {
      this.stopRotating();
    }

    ,'dragStart': function (evt, ui) {
      this.dimPathLine();
    }

    ,'dragEnd': function (evt, ui) {
      this.updateModel();
      app.view.cssOutput.renderCSS();
      publish(constant.UPDATE_CSS_OUTPUT);
    }

    ,'render': function () {
      this.$el.css({
        'left': this.model.get('x') + 'px'
        ,'top': this.model.get('y') + 'px'
        ,'transform': 'rotate(' + this.model.get('r') + 'deg)'
      });
    }

    ,'updateModel': function () {
      var pxTo = util.pxToNumber;
      this.model.set({
        'x': pxTo(this.$el.css('left'))
        ,'y': pxTo(this.$el.css('top'))
        ,'r': util.getRotation(this.$el)
      });
      publish(constant.PATH_CHANGED);
      app.collection.actors.getCurrent().updateKeyframeFormViews();
      app.kapi.update();
    }

    ,'dimPathLine': function () {
      app.view.canvas.backgroundView.update(true);
    }

    ,'startRotating': function (startingX, startingY) {
      this._previousRotationDragX = 0;
      this._previousRotationDragY = 0;
      this._currentRotationDragX = startingX;
      this._currentRotationDragY = startingY;
      this._mouseupHandler = _.bind(this.onMouseupRotatorArm, this);
      this._mousemoveHandler = _.bind(this.onMouseMoveRotator, this);
      this._keyupHandler = _.bind(this.onKeyupRotator, this);
      this._isRotating = true;
      $win
        .on('mouseup', this._mouseupHandler)
        .on('mousemove', this._mousemoveHandler)
        .on('keyup', this._keyupHandler);
    }

    ,'stopRotating': function () {
      this._isRotating = false;
      this.updateModel();
      $win
        .off('mouseup', this._mouseupHandler)
        .off('mousemove', this._mousemoveHandler)
        .off('keyup', this._keyupHandler);
    }

    ,'rotateForDragDelta': function (currentX, currentY) {
      this._previousRotationDragX = this._currentRotationDragX;
      this._previousRotationDragY = this._currentRotationDragY;
      this._currentRotationDragX = currentX;
      this._currentRotationDragY = currentY;
      var deltaX = currentX - this._previousRotationDragX;
      var deltaY = currentY - this._previousRotationDragY;
      var totalDelta = deltaX + deltaY;
      var currentRotation = util.getRotation(this.$el);
      var newRotation = currentRotation + totalDelta;
      this.$el.css('transform', 'rotate(' + newRotation + 'deg)');
    }

    ,'tearDown': function () {
      this.remove();
      util.deleteAllProperties(this);
    }

  });

});
