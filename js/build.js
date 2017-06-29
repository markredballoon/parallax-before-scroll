(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();

var ParallaxEffect = function () {
  (0, _createClass3.default)(ParallaxEffect, [{
    key: "getScrollTop",


    /**
     * Get the current scroll top value
     */
    value: function getScrollTop() {
      if (typeof pageYOffset != "undefined") {
        return pageYOffset;
      } else {
        var B = document.body;
        var D = document.documentElement;
        D = D.clientHeight ? D : B;
        return D.scrollTop;
      }
    }

    /**
     * Update the postion of the parallax elements
     * @param {array} elements - Array of elements to add the parallax effect to.
     * @param {number} ratio - Set the parallax constant
     */

  }, {
    key: "positionParllaxElements",
    value: function positionParllaxElements(elements, ratio) {
      for (var i = 0; i < elements.length; i++) {
        var thisEle = elements[i];
        var screenTop = thisEle.parentElement.getBoundingClientRect().top;
        var top = screenTop + this.getScrollTop();
        thisEle.style.top = -(top / ratio) + "px";
        thisEle.style.height = 100 * (1 + 1 / ratio) + "%";
      }
    }

    /**
     * Replace the native events with custom events
     * @param {array} elements - Array of elements to add the parallax effect to.
     * @param {number} ratio - Set the parallax constant
     */

  }, {
    key: "customEvent",
    value: function customEvent(type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function func() {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(function () {
          obj.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };
      obj.addEventListener(type, func);
    }

    /**
     * Replaces the native scroll events
     * @param {Obj} event - Event object
     */

  }, {
    key: "scrollReplace",
    value: function scrollReplace(event) {
      if (!this.responsive) {
        this.lastScrollSimulated = true;
        event.preventDefault();

        var newScrollTop = this.scrollTop + event.deltaY;

        if (newScrollTop < 0) {
          this.scrollTop = 0;
        } else if (newScrollTop > this.scrollHeight) {
          this.scrollTop = this.scrollHeight;
        } else {
          this.scrollTop = newScrollTop;
        }

        this.scrollHandler();
        window.scrollBy(0, event.deltaY);

        return false;
      }
    }

    /**
     * Handles the scroll event
     */

  }, {
    key: "scrollHandler",
    value: function scrollHandler() {
      if (this.responsive) {
        for (var i = 0; i < this.parallaxElements.length; i++) {
          var thisEle = this.parallaxElements[i];
          var parent = thisEle.parentElement;
          if (parent.getBoundingClientRect().top < document.documentElement.clientHeight + 50) {
            thisEle.style.opacity = 1;
          } else {
            thisEle.style.opacity = 0;
          }
          thisEle.style.transform = "none";
        }
        return true;
      }

      for (var _i = 0; _i < this.parallaxElements.length; _i++) {
        this.parallaxElements[_i].style.opacity = 1;
        this.parallaxElements[_i].style.transform = "translateY(" + this.scrollTop / 3 + "px)";
      }
      return true;
    }

    /**
     * Handles the resize event
     */

  }, {
    key: "resizeHandler",
    value: function resizeHandler(event) {
      this.scrollTop = this.getScrollTop();
      this.scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.positionParllaxElements(this.parallaxElements, this.pRatio);
      this.responsive = window.innerWidth < this.breakpoint;
    }

    /**
     * Constructor function
     */

  }]);

  function ParallaxEffect(selector, parllaxRatio, breakpoint) {
    var _this = this;

    (0, _classCallCheck3.default)(this, ParallaxEffect);

    this.breakpoint = breakpoint || 0; // Breakpoint for the mobile view
    this.pRatio = parllaxRatio; // save the parallax ratio
    this.parallaxElements = document.getElementsByClassName(selector); // cache the parallax elements

    this.responsive = window.innerWidth < this.breakpoint; // should the parallax elements display using mobile view

    this.customEvent("resize", "optimizedResize"); // init custom events
    this.customEvent("scroll", "optimizedScroll"); // init custom events

    this.scrollTop = this.getScrollTop(); // Get the current screen position

    this.scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; // Get the current document scrollable height

    this.positionParllaxElements(this.parallaxElements, this.pRatio); // Set up the parallax elements positions

    this.lastScrollSimulated = false; // allows the scroll event listener to check if the last scroll event was simulated or native

    window.addEventListener("mousewheel", this.scrollReplace.bind(this)); // Add mousewheel listener
    window.addEventListener("wheel", this.scrollReplace.bind(this)); // Add wheel listener
    window.addEventListener("touchmove", function (e) {
      console.log(e.changedTouches, e);
      // this.scrollReplace(e);
    }); // Add touchmove listener

    window.addEventListener("optimizedScroll", function (event) {
      if (_this.lastScrollSimulated) {
        _this.lastScrollSimulated = false;
      } else {
        _this.scrollTop = _this.getScrollTop();
        _this.scrollHandler();
      }
    }); // Add scroll listener

    window.addEventListener("optimizedResize", this.resizeHandler.bind(this)); // Add resize listener
  }

  return ParallaxEffect;
}();

(function () {
  /*
  // For testing:
  window.addEventListener('scroll', function(event) {
    document.getElementById("checkScroll").innerHTML = window.pageYOffset;
  });
  // For testing:
  window.addEventListener('touchmove', function(event) {
    document.getElementById("checkScroll").innerHTML = window.pageYOffset;
  });
  */

  // Initialize the parallax effect:
  window.parallaxEffect = new ParallaxEffect("parallax-moving", 3, 767);
})();

},{"babel-runtime/helpers/classCallCheck":3,"babel-runtime/helpers/createClass":4}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":5}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":2}],5:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":6}],6:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}]},{},[1]);
