define([
  'text!' + requirejs.s.contexts._.config.tpress_uri
], function(pressed_json) {

  pressed = JSON.parse(pressed_json);

  var injected_csses = {};


  function css_inject(name, css) {
    if (name in injected_csses) {
      return false;
    }

    var head = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");

    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    }
    else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    injected_csses[name] = true;
    return true;
  }

  function clean(name) {
    var options = {};
    if (name.match(/!css$/g, "")) {
      options.name = name.replace(/!css$/g, "");
      options.type = "css";
    }
    else {
      options.name = name;
      options.type = "html";
    }
    return options;
  }

  function finalize(file, text, onLoad) {
    switch (file.type) {
      case "css":
        css_inject(file.name, text);
        onLoad(true);
        break;
      default:
        onLoad(text);
    }
  }

  return {
    load: function (name, require, onLoad, config) {
      var file = clean(name);

      if (file.name in pressed) {
        finalize(file, pressed[file.name], onLoad);
      }
      else {
        require(['text!' + file.name], function(text) {
          finalize(file, text, onLoad);
        });
      }
    }
  };
});
