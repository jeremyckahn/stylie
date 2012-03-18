define(['exports', 'src/model/keyframe'], function (keyframes, keyframe) {
  keyframes.collection = Backbone.Collection.extend({

    'model': keyframe.model

    ,'initialize': function () {

    }

  });
});
