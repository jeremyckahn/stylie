#!/bin/bash

COMMAND=$1
BIN="./node_modules/.bin"
DIST="dist"

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

    appcache-manifest \
      "$DIST/"{index.html,main.js,img/*} \
      "$DIST/*".{png,svg,woff,eot,ttf} \
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

  deploy )
    npm run build
    cp package.json "$DIST/package.json"

    gh-pages \
      --dotfiles \
      --dist="$DIST" \
      --src="**/**" \
      --message="Automated deploy commit."
  ;;

  fast-build:watch )
    nodemon \
      --watch scripts \
      --watch styles \
      --exec "npm run build:js"
  ;;

  lint )
    jshint \
      --config=".jshintrc" \
      scripts --exclude="scripts/lib/*" \
      && echo "All good! 👍"
  ;;
esac
