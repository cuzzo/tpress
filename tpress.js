#! /usr/bin/env node

fs = require("fs");
_ = require("underscore");
glob = require("glob");
Q = require("q");
cssmin = require("cssmin");
htmlmin = require("html-minifier").minify;

/**
 * TODO: Add options to main().
 */
var htmlmin_options = {
  removeComments: true,
  removeCDATASectionsFromCDATA: true,
  removeEmptyAttributes: true,
  cleanAttributes: true,
  collapseWhitespace: true
};

function compress(data, file, min_options) {
  if (file.match(/\.html?$/)) {
    return htmlmin(data, min_options.html);
  }
  if (file.match(/\.css$/)) {
    return cssmin(data);
  }
  return data;
}

function get_files(glob_pattern) {
  var deferred = Q.defer();
  glob(glob_pattern, {}, function(er, files) {
    deferred.resolve(files);
  });
  return deferred.promise;
}

function read_files(files, min_options) {
  var file_data = {};
  _.each(files, function(file) {
    var data = fs.readFileSync(file, "utf8");
    file_data[file] = compress(data, file, min_options);
  });
  return file_data;
}


function press_glob_results(get_files_results, min_options) {
  var files_data = {};
  _.each(get_files_results, function(files) {
    _.extend(files_data, read_files(files, min_options));
  });
  return JSON.stringify(files_data);
}

function get_glob_promise(globs) {
  var files = [];
  var get_files_promises = _.map(globs, function(glob) {
    return get_files(glob);
  });
  return Q.all(get_files_promises);
}

function main(argc, argv) {
  var globs = argv.slice(2);
  var glob_promises = get_glob_promise(globs);
  glob_promises.done(function(glob_results) {
    var json = press_glob_results(glob_results, {
      html: htmlmin_options
    });
    console.log(json);
  });
}

if (require.main === module) {
  main(process.argv.length, process.argv);
}

module.exports = {
  get_glob_promise: get_glob_promise,
  press_glob_results: press_glob_results
};
