define([
  'text!tpl/tpressed.html'
], function(pressed_json) {

  pressed = JSON.parse(pressed_json);

  return {
    load: function (name, require, onLoad, config) {
      onLoad(pressed[name]);
    }
  };
});
