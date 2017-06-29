/**
 * @license Asparagus v1.0
 * (c) 2013 Form5 http://form5.is
 * License: MIT
 */
// MMEDIT: Create global variable for the parallax speed
var speedDivider = 3;
var bgElms;

(function() {
  var lastScrollY = 0,
    ticking = false;

  bgElms = document.getElementsByClassName('parallax-effect'); // MMEDIT: created array of parralax elements.


  // Update background position
  var updatePosition = function() {
    var translateValue = lastScrollY / speedDivider;

    // We don't want parallax to happen if scrollpos is below 0
    if (translateValue < 0)
      translateValue = 0;

    // MMEDIT: changed the code to run through the array.
    for (var i = bgElms.length - 1; i >= 0; i--) {
      translateY(bgElms[i], translateValue)
    }
    // translateY(bgElm, translateValue);

    // Stop ticking
    ticking = false;
  };

  // Translates an element on the Y axis using translate3d to ensure
  // that the rendering is done by the GPU
  var translateY = function(elm, value) {
    var translate = 'translate3d(0px,' + value + 'px, 0px)';
    elm.style['-webkit-transform'] = translate;
    elm.style['-moz-transform'] = translate;
    elm.style['-ms-transform'] = translate;
    elm.style['-o-transform'] = translate;
    elm.style.transform = translate;
  };

  // This will limit the calculation of the background position to
  // 60fps as well as blocking it from running multiple times at once
  var requestTick = function() {
    if (!ticking) {
      window.requestAnimationFrame(updatePosition);
      ticking = true;
    }
  };

  // Update scroll value and request tick
  var doScroll = function() {
    lastScrollY = window.pageYOffset;
    requestTick();
  };


  // Initialize on domready
  (function() {
    var loaded = 0;
    var bootstrap = function() {
      if (loaded) return;
      loaded = 1;

      rafPolyfill();
      window.onscroll = doScroll;
    };

    if (document.readyState === 'complete') {
      setTimeout(bootstrap);
    } else {
      document.addEventListener('DOMContentLoaded', bootstrap, false);
      window.addEventListener('load', bootstrap, false);
    }
  })();

  // RequestAnimationFrame polyfill for older browsers
  var rafPolyfill = function() {
    var lastTime, vendors, x;
    lastTime = 0;
    vendors = ["webkit", "moz"];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  };

}).call(this);


// Custom JS for making the JS work for multiple images

// Finds the offset from the top of the sreen of an element
function findPos(obj) {
  var curleft = 0,
    curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
};

// function that sets the top position based on the element offset and the parallax rate.
var multiParralaxSetup = function(item) {
  item.style.top = '0';
  var currentOffset = findPos(item).y;
  item.style.top = '-' + (currentOffset / speedDivider) + 'px';
};

// Function that works when the page loads and changes the position of the elements.
function doLoad() {
  for (var i = bgElms.length - 1; i >= 0; i--) {
    multiParralaxSetup(bgElms[i]);
  };
};

if (window.addEventListener) {
  window.addEventListener("load", doLoad, false);
} else
if (window.attachEvent) {
  window.attachEvent("onload", doLoad);
} else
if (window.onLoad) {
  window.onload = doLoad;
}


// Resize event
if (window.attachEvent) {
  window.attachEvent('onresize', function() {
    doLoad();
  });
} else if (window.addEventListener) {
  window.addEventListener('resize', function() {
    doLoad();
  }, true);
} else {
  //The browser does not support Javascript event binding
}