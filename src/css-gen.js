;(function (global) {
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

  function renderCSS3KeyframeSegment (point, index, totalPoints) {
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
  }

  function generateCSS3Keyframes (
      identifier, points, opt_vendorPrefix) {
    var cssString = [printf('@%skeyframes %s {\n',
        [opt_vendorPrefix || '', identifier])];
    var pointsLen = points.length;
    cssString.push(renderCSS3KeyframeSegment(points[0], 'from', pointsLen));

    _.each(points, function (point, i) {
      keyframeStr = renderCSS3KeyframeSegment(point, i, pointsLen);
      cssString.push(keyframeStr);
    });

    cssString.push(renderCSS3KeyframeSegment(points[0], 'to', pointsLen));
    cssString.push('}');
    return cssString.join('');
  }

  global.generateCSS3Keyframes = generateCSS3Keyframes;
} (this));
