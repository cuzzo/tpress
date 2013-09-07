define([
  "text!" + requirejs.s.contexts._.config.tpress.uri
], function(pressed_json) {
  var pressed = JSON.parse(pressed_json);

  function clean(name, tpress_settings) {
    var options = {};
    for (var type in tpress_settings.type_map) {
      var regex = new RegExp("!" + type + "$", "g");
      if (name.match(regex)) {
        return {
          name: name.replace(regex, ""),
          type: tpress_settings.type_map[type]
        };
      }
    }
    return {
      name: name,
      type: ""
    };
  }

  function finalize(file, text, onLoad, tpress_settings) {
    var backends = tpress_settings.backends;
    if (file.type in backends) {
      require([backends[file.type] + "!"], function(callback) {
        var result = callback(file.name, text);
        onLoad(result);
        return true;
      });
    }
    else {
      onLoad(text);
      return true;
    }
  }

  return {
    load: function(name, require, onLoad, config) {
      var file = clean(name, config.tpress);

      if (file.name in pressed) {
        finalize(file, pressed[file.name], onLoad, config.tpress);
      }
      else {
        require(['text!' + file.name], function(text) {
          finalize(file, text, onLoad, config.tpress);
        });
      }
    }
  };
});
