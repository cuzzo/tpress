define([
  "underscore",
], function(_) {
  function template(name, text) {
    return _.template(text);
  }

  return {
    load: function(name, require, onLoad, config) {
      onLoad(template);
    }
  };
});
