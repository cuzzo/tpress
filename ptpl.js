define([], function() {
  "use strict";

  // Holds the entire contents of all compressed files--indexed by file path.
  var _pressed = null;

  var inlined = false;
  var require_config = {};

  /**
   * Escapes plaintext for javascript.
   *
   * Stolen form requirejs text plugin.
   */
  function js_escape(content) {
    return content.replace(/(['\\])/g, '\\$1')
                  .replace(/[\f]/g, "\\f")
                  .replace(/[\b]/g, "\\b")
                  .replace(/[\n]/g, "\\n")
                  .replace(/[\t]/g, "\\t")
                  .replace(/[\r]/g, "\\r")
                  .replace(/[\u2028]/g, "\\u2028")
                  .replace(/[\u2029]/g, "\\u2029");
  }


  /**
   * Deserializes the loaded file into an object.
   *
   * @param str pressed_json
   *   The compressed file as plain text.
   */
  function unpress(pressed_json) {
    if (!pressed_json) {
      _pressed = {};
      return;
    }
    _pressed = JSON.parse(pressed_json);
  }

  /**
   * Strips the backend command (tpl, css, etc.) from the load name.
   *
   * @param str name
   *   The load name (in ptpl!my_template.html!tpl "my_template.html!tpl").
   * @param Object tpress_settings
   *   The requirejs tpress config.
   *
   * @return Object
   *   name: file name ("my_template.html")
   *   type: backend command (tpl)
   */
  function parse(name, tpress_settings) {
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

  /**
   * Loads a files text and then returns the output of the specified backend
   * command (or the plain text if no backend command is specified).
   *
   * @param str file
   *   A parsed load file (@see parse)
   * @param str text
   *   Plain text from "file".
   * @param function onLoad
   *   A requirejs onLoad callback.
   * @param Object tpress_settings
   *   The requirejs tpress config.
   */
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

  /**
   * Check _pressed for the file.  If it does not exist, use "text" plugin
   * to load the file manually.
   */
  function load_file(name, onLoad, tpress_settings) {
    var file = parse(name, tpress_settings);

    if (file.name in _pressed) {
      finalize(file, _pressed[file.name], onLoad, tpress_settings);
    }
    else {
      require(['text!' + file.name], function(text) {
        finalize(file, text, onLoad, tpress_settings);
      });
    }
  }

  return {
    load: function(name, require, onLoad, config) {
      if (config.isBuild) {
        require_config = config;
        onLoad();
        return;
      }

      /**
       * If _pressed is not yet loaded, load it and then load the desired file.
       */
      if (_pressed === null) {
        var tpressed = config.tpress.inline ? "tpressed"
                                            : "text!" + config.tpress.uri;
        require([tpressed], function(pressed_json) {
          unpress(pressed_json);
          load_file(name, onLoad, config.tpress);
        });
      }
      else {
        load_file(name, onLoad, config.tpress);
      }
    },
    write: function(pluginName, moduleName, write) {
      if (require_config.tpress.inline !== true || inlined === true) {
        return;
      }
      inlined = true;
      var uri = require_config.tpress.uri;
      var fs = require.nodeRequire("fs");
      var tpressed = js_escape(fs.readFileSync(uri, "utf8"));
      write.asModule("tpressed",
            "define(function () { return '" + tpressed + "';});\n");
    }
  };
});
