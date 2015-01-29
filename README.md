# Stylie - A CSS 3 animation tool

Stylie is a fun tool for easily creating CSS 3 animations. Quickly design your
animation graphically, grab the generated CSS and go!  To learn how to use the
app, either run it locally (see below) or go to
http://jeremyckahn.github.io/stylie/ and click the "?" icon in the header for a
manual.

## Install locally

Requirements:

* Node[NodeJS](http://nodejs.org/)/NPM,
* [Bower](http://bower.io/) (version 1.0 or above)
* [Grunt](http://gruntjs.com/)
* [Sass](http://sass-lang.com/) and [Compass](http://compass-style.org/)

Clone this repo and install the dependencies:

````
npm install && bower install
````

To run the app:

````
grunt serve
````

You can now access Stylie from http://localhost:9000.

## Developing Stylie

You can build the project with:

````
grunt build
````

And test the build load locally with:

````
grunt serve:dist
````

## Contributors

I can't design things, but I know people that can.  The overall look of the app
is courtesy of [Jon Victorino](http://www.jonvictorino.com/).  The Help icon
was masterfully crafted by [@nrrrdcore](https://github.com/nrrrdcore).

## License

Stylie is distributed under a [CC BY-NC-SA
license](http://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).  Don't
worry, this license does not extend to the animations you create with Stylie,
just the application itself.  You are free to use the animations created by
Stylie however you please.  You are encouraged to use and modify the code to
suit your needs, as well as redistribute it noncommercially.
