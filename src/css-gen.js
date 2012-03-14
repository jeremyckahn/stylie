define(['exports'], function (cssGen) {

  var IDENTIFIER_SUFFIX = '-keyframes';

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
          [((100 / totalPoints) * (index + 1)).toFixed(2)]);
    }

    _.each(point, function (pointVal, pointKey) {
      var cssProp = CSS_EQUIV_KEYS[pointKey] || cssProp;
      keyframeStr += printf('%s: %spx; ', [cssProp, pointVal.toFixed(2)]);
    });

    keyframeStr += '} \n';
    return keyframeStr;
  };

  cssGen.generateAnimationClass = function (
      identifier, duration, opt_vendorPrefixes) {
    var duration = printf('%sms', [duration]);
    var classChunks = [printf('.%s {', [identifier])];
    _.each(opt_vendorPrefixes, function (prefix) {
      // TODO: This will break if there is no `prefix`. Refactor this into a
      // helper.
      classChunks.push(printf('  %sanimation-duration: %s;',
          [prefix + '-', duration]));
      classChunks.push(printf('  %sanimation-name: %s;',
          [prefix + '-', identifier + IDENTIFIER_SUFFIX]));
    });
    classChunks.push('}');
    return classChunks.join('\n');
  };

  cssGen.generateCSS3Keyframes = function (
      identifier, points, opt_vendorPrefix) {
    if (opt_vendorPrefix) {
      opt_vendorPrefix += '-';
    }

    var cssString = [printf('@%skeyframes %s {\n',
        [opt_vendorPrefix || '', identifier + IDENTIFIER_SUFFIX])];
    var pointsLen = points.length;
    cssString.push(cssGen.renderCSS3KeyframeSegment(
        points[0], 'from', pointsLen));

    _.each(points.slice(1, -1), function (point, i) {
      keyframeStr = cssGen.renderCSS3KeyframeSegment(point, i, pointsLen - 1);
      cssString.push(keyframeStr);
    });

    cssString.push(cssGen.renderCSS3KeyframeSegment(_.last(points), 'to',
          pointsLen));
    cssString.push('}');
    return cssString.join('');
  };

  cssGen.generateCSS3ClassAndKeyframes = function (
      identifier, points, duration, opt_vendorPrefixes) {
    var stringChunks = [cssGen.generateAnimationClass(
        identifier, duration, opt_vendorPrefixes) + '\n'];

    opt_vendorPrefixes = opt_vendorPrefixes || [''];
    _.each(opt_vendorPrefixes, function (prefix) {
      stringChunks.push(cssGen.generateCSS3Keyframes(
          identifier, points, prefix));
    });

    return stringChunks.join('\n');
  };

});
