define(['exports', 'src/model/keyframe'], function (crosshair, keyframe) {

  var $win = $(window);

  var CROSSHAIR_TEMPLATE = [
    '<div class="crosshair {{extraClass}}" data-pos="{{position}}" data-percent="{{percent}}">'
      ,'<div class="dashmark horiz"></div>'
      ,'<div class="dashmark vert"></div>'
      ,'<div class="rotation-arm">'
        ,'<div class="rotation-handle">'
      ,'</div>'
    ,'</div>'].join('');

  crosshair.generateHtml = function (extraClass, position, percent) {
    return Mustache.render(CROSSHAIR_TEMPLATE, {
      'extraClass': extraClass
      ,'position': position
      ,'percent': percent
    });
  };

  crosshair.view = Backbone.View.extend({

    'events': {
      'mousedown .rotation-arm': 'onClickRotationArm'
    }

    ,'initialize': function (opts) {
      _.extend(this, opts);
      this.$el.dragon({
        'within': this.$el.parent()
        ,'dragStart': _.bind(this.dragStart, this)
        ,'dragEnd': _.bind(this.dragEnd, this)
      });

      this.$el.css('transform', 'rotate(0deg)');

      this._isRotating = false;
      this.model.set('percent', +this.$el.data('percent'));
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
      this.app.view.cssOutputView.renderCSS();
      publish(this.app.constant.UPDATE_CSS_OUTPUT);
    }

    ,'render': function () {
      this.$el.css({
        'left': this.model.get('x') + 'px'
        ,'top': this.model.get('y') + 'px'
        ,'transform': 'rotate(' + this.model.get('r') + 'deg)'
      });
    }

    ,'updateModel': function () {
      var pxTo = this.app.util.pxToNumber;
      this.model.set({
        'x': pxTo(this.$el.css('left'))
        ,'y': pxTo(this.$el.css('top'))
        ,'r': this.app.util.getRotation(this.$el)
      });
      publish(this.app.constant.KEYFRAME_UPDATED);
      this.app.collection.keyframes.updateModelKeyframeViews();
      this.app.kapi.update();
    }

    ,'dimPathLine': function () {
      this.app.canvasView.backgroundView.update(true);
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
      var currentRotation = this.app.util.getRotation(this.$el);
      var newRotation = currentRotation + totalDelta;
      this.$el.css('transform', 'rotate(' + newRotation + 'deg)');
    }

  });
});
