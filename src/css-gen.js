define(['exports'], function (cssGen) {

  function printf (formatter, args) {
    var composedStr = formatter;
    _.each(args, function (arg) {
      composedStr = composedStr.replace('%s', arg);
    });

    return composedStr;
  }

  var CSS_EQUIV_KEYS = {
    'x': 'left'
    ,'y': 'top'
  };

  cssGen.renderCSS3KeyframeSegment = function (point, index, totalPoints) {
    var keyframeStr;
    if (index === 'to' || index === 'from') {
      keyframeStr = printf('  %s { ', [index]);
    } else {
      keyframeStr = printf('  %s% { ',
          [((totalPoints / 100) * index).toFixed(2)]);
    }

    _.each(point, function (pointVal, pointKey) {
      var cssProp = CSS_EQUIV_KEYS[pointKey] || cssProp;
      keyframeStr += printf('%s: %spx; ', [cssProp, pointVal.toFixed(2)]);
    });

    keyframeStr += '} \n';
    return keyframeStr;
  };

  cssGen.generateCSS3Keyframes = function (
      identifier, points, opt_vendorPrefix) {
    var cssString = [printf('@%skeyframes %s {\n',
        [opt_vendorPrefix || '', identifier])];
    var pointsLen = points.length;
    cssString.push(cssGen.renderCSS3KeyframeSegment(points[0], 'from', pointsLen));

    _.each(points, function (point, i) {
      keyframeStr = cssGen.renderCSS3KeyframeSegment(point, i, pointsLen);
      cssString.push(keyframeStr);
    });

    cssString.push(cssGen.renderCSS3KeyframeSegment(points[0], 'to',
          pointsLen));
    cssString.push('}');
    return cssString.join('');
  };

});
