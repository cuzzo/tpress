define([
], function() {
  var _injected_csses = {};

  function css_inject(name, css) {
    if (name in _injected_csses) {
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
    _injected_csses[name] = true;
    return true;
  }

  return {
    load: function(name, require, onLoad, config) {
      onLoad(css_inject);
    }
  };
});
