/*global window: true */

if (typeof window === "undefined") {
  global.window = global;
}
if (typeof fetch === "undefined") {
  global.fetch = function() {};
}

require("tabris");

let ClientSpy = function() {
};

ClientSpy.prototype = {

  create: function() {
  },

  get: function() {
  },

  set: function() {
  },

  call: function() {
  },

  listen: function() {
  },

  destroy: function() {
  }

};

tabris._init(new ClientSpy());
