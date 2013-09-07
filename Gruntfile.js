"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tpress: {
      options: {
        globs: ["tpl/**/*.html", "css/**/*.css"],
        output: "tp.json"
      }
    }
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("dist", ["tpress"]);
};
