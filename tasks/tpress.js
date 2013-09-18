"use strict";

module.exports = function(grunt) {
  var fs = require("fs");
  var path = require("path");
  var mkdirp = require("mkdirp");
  var tpress = require("../tpress");

  grunt.registerTask("tpress", "Compress your files", function() {
    var options = this.options();
    var done = this.async();

    var glob_promise = tpress.get_glob_promise(options.globs);
    var min_options = options.min;

    glob_promise.done(function(glob_results) {
      var json = tpress.press_glob_results(glob_results, min_options);
      mkdirp(path.dirname(options.output), function(err) {
        if (err) {
          grunt.log.error("Could not create path to " + options.output);
        }
        fs.writeFile(options.output, json, function(err) {
          if (err) {
            grunt.log.error("Could not write to file " + options.output);
          }
          done();
        });
      });
    });
  });
};
