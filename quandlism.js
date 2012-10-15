(function(exports) { 
/*
 * quandlism
 * https://github.com/jbyck/quandlism
 *
 * Copyright (c) 2012 Jason Byck
 * Licensed under the MIT license.
 */

var quandlism = exports.quandlism = { version: '0.1.0' }

quandlism.context = function() {
  var context = new quandlism_context,
  step = 1e4,
  size = 1440,
  event = d3.dispatch('prepare', 'beforechange', 'change', 'focus');  
}

function quandlism_context() {}

var quandlism_contextPrototype = quandlism.context.prototype = quandlism_context.prototype;
 })(this);