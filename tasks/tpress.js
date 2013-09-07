"use strict";

module.exports = function(grunt) {
  var fs = require("fs");
  var tpress = require("../tpress");

  grunt.registerTask("tpress", "Compress your files", function() {
    var options = this.options();
    var done = this.async();

    var glob_promise = tpress.get_glob_promise(options.globs);

    glob_promise.done(function(glob_results) {
      var json = tpress.press_glob_results(glob_results);
      fs.writeFile(options.output, json);
      done();
    });
  });
};
