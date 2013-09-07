define([
  'text!' + requirejs.s.contexts._.config.tpress_uri
], function(pressed_json) {

  pressed = JSON.parse(pressed_json);

  return {
    load: function (name, require, onLoad, config) {
      if (name in pressed) {
        onLoad(pressed[name]);
      }
      else {
        require(['text!' + name], function(text) {
          onLoad(text);
        });
      }
    }
  };
});
