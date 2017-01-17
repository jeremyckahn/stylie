#!/bin/bash

COMMAND=$1
BIN="./node_modules/.bin"
DIST="dist"
FONT_DIR="node_modules/bootstrap-sass/assets/fonts/bootstrap/"

export PATH=$BIN:$PATH

case "$COMMAND" in
  build )
    export NODE_ENV=production

    rm -rf "$DIST"

    npm run build:js

    imagemin \
      img/*.{png,jpg,jpeg} \
      --out-dir="$DIST/img"

    cp index.html "$DIST/"
    cp .nojekyll "$DIST/"

    mkdir -p "$DIST/$FONT_DIR"
    cp -r \
      "$FONT_DIR"* \
      "$DIST/$FONT_DIR"

    appcache-manifest \
      "$DIST/index.html" \
      "$DIST/main.js" \
      "$DIST/img/*" \
      "$DIST/$FONT_DIR*" \
      --network-star \
      -prefix="/stylie" \
      --output="$DIST/manifest.appcache"

    echo "
SETTINGS:
prefer-online" >> "$DIST/manifest.appcache"

  ;;

  build:js )
    echo "Building JavaScript and CSS... please wait a moment."
    webpack -d --optimize-minimize
  ;;

  fast-build:watch )
    nodemon \
      --watch scripts \
      --watch styles \
      --exec "npm run build:js"
  ;;
esac
