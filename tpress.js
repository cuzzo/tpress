#! /usr/bin/env node

fs = require("fs");
_ = require("underscore");
glob = require("glob");
Q = require("q");

function get_files(glob_pattern) {
  deferred = Q.defer();
  glob(glob_pattern, {}, function(er, files) {
    deferred.resolve(files);
  });
  return deferred.promise;
}

function read_files(files) {
  var file_data = {};
  _.each(files, function(file) {
    var data = fs.readFileSync(file, "utf8");
    file_data[file] = data;
  });
  return file_data;
}

function main(argc, argv) {
  console.log(argv[2]);
  get_files(argv[2]).done(function(files) {
    file_data = read_files(files);
    console.log(JSON.stringify(file_data));
  });
}

if (require.main === module) {
  main(process.argv.length, process.argv);
}
