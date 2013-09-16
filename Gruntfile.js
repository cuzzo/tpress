"use strict";

module.exports = function(grunt) {
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
};
