#! /usr/bin/env node

fs = require("fs");
_ = require("underscore");
glob = require("glob");
Q = require("q");
cssmin = require("cssmin");
htmlmin = require("html-minifier").minify;

var htmlmin_options = {
  removeComments: true,
  removeCDATASectionsFromCDATA: true,
  removeEmptyAttributes: true,
  cleanAttributes: true,
  collapseWhitespace: true
};

function compress(data, file) {
  if (file.match(/\.html?$/)) {
    return htmlmin(data, htmlmin_options);
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

function read_files(files) {
  var file_data = {};
  _.each(files, function(file) {
    var data = fs.readFileSync(file, "utf8");
    file_data[file] = compress(data, file);
  });
  return file_data;
}


function press_glob_results(get_files_results) {
  var files_data = {};
  _.each(get_files_results, function(files) {
    _.extend(files_data, read_files(files));
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
  glob_promise.done(function(glob_results) {
    var json = press_glob_results(glob_results);
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
