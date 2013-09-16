tpress
======

A simple resource (templates, css, images, etc.) compressor / compiler for requirejs.

Usage
-----

tpress comes with an executable that makes it an easy standalone application to use.  It also comes with a [Grunt](http://gruntjs.com "Grunt JS Website") task that makes it easy to use in a Grunt project.

### Standalone

tpress depends on [node](http://nodejs.org "Node JS Website").  Checkout the [node installation manual](https://github.com/joyent/node/wiki/Installation "Node Installation Manual") if you need help installing node.

Once node is installed, tpress can be run like so:

```bash
tpress "path/to/css/**/*.css" "path/to/other/css/**/*.css" "path/to/tpl/**/*.html"
```

That will output the compressed json blob to the console.  You can redirect it to a file like so:

```bash
tpress "path/to/css/**/*.css" "path/to/other/css/**/*.css" "path/to/tpl/**/*.html" > tpressed.json
```

tpress takes a list of [globs](https://github.com/isaacs/node-glob "Javascript Glob Documentation") as arguments.

### Grunt Task

tpress comes with an example Gruntfile.  Checkout the [GruntJS Sample Gruntfile](http://gruntjs.com/sample-gruntfile "GruntJS Sample Gruntfile") if you need hlep understanding how it works.

```javascript
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tpress: {
      options: {
        globs: ["tpl/**/*.html", "css/**/*.css"],
        output: "tp.json",
        min: {
          html: {
            removeComments: true,
            removeCDATASectionsFromCDATA: true,
            removeEmptyAttributes: true,
            cleanAttributes: true,
            collapseWhitespace: true
          }
        }
      }
    }
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("dist", ["tpress"]);
```

tpress has three options:

* globs: a list of [globs](https://github.com/isaacs/node-glob "Javascript Glob Documentation").
* output: the destination for the compressed files.
* min: a list of minification options by file type.  Currently, only html is supported.  Checkout [html-min](https://github.com/kangax/html-minifier "Javascript HTML Minifier") for a list of html minification options.

[RequireJS](http://requirejs.org "RequireJS Home Page") Config
--------------------------------------------------------------

You need to configure three options in your requirejs config for tpress to properly load the compressed files inside your ```tpressed.json``` file.

```javascript
requirejs.config({
  baseUrl: "./",
  tpress: {
    uri: "dist/tpressed.json",
    backends: {
      css: "lib/tpress/backends/css",
      _: "lib/tpress/backends/_"
    },
    type_map: {
      css: "css",
      tpl: "_"
    }
  }
});
```

* uri: this is the path to your ```tpressed.json``` file.
* backends: this is a dictionary of the tpressed backends that you're using.  NOTE: the above assumes that you've coppied tpress's ```backends``` directory to ```lib/tpress``` relative to your config file.
* type_map: this is a dictionary mapping file type commands to backend plugins.

Requiring compressed resources
------------------------------

```javascript
require(["ptpl!css/my-style.css!css"], function() {
  alert("my style has been loaded.  I don't need to do anything. ~~/==/:3");
});
```
###NOTE

if you don't put a ```!css``` or ```!tpl``` or ```!custom_plugin``` at the end of your desired file, tpress will return the plain text--and then you're free to do whatever you want with the plain text of the desired file.

Currently, the only backends are for loading [underscore](http://underscorejs.org "Underscore JS Home Page") templates and CSS files.

Loading an underscore template would look like:

```javascript
require(["ptpl!tpl/my-template.html!tpl"], function(underscore_template) {
  alert(underscore_template());
});
```

In the above example, ```underscore_template``` is a loaded underscore template, ready to render.  I.E., there's no need to do the [text](https://github.com/requirejs/text "RequireJS Text Plugin") equivalent:

```javascript
require([
  "underscore",
  "text!tpl/my-template.html"
], function(_, plain_text) {
  var underscore_template = _.template(plain_text);
  alert(underscore_template());
});
```

I.E., there's no need to run ```_.template()``` on the returned value from ptpl with the underscore backend plugin.

Plugins
-------

tpress plugins are glorified functions that take two parameters.  The plugin's return value is the ultimate value that is returned by the require() call.

For example, if you wanted to write a module that returns the inverse of the files contents, it would be:

```javascript
define([], function() {
  function invert(name, text) {
    return text.split("").reverse().join("");
  }

  return {
    load: function(name, require, onLoad, config) {
      onLoad(invert);
    }
  };
});
```

NOTE: [you really don't want to reverse strings like this](http://stackoverflow.com/a/16776621 "Proper way to reverse strings in Javascript").


License
-------

tpress is free--as in BSD. Hack your heart out, hackers.
