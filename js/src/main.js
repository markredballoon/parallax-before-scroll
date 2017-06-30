// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
})();

class ParallaxEffect {

  /**
   * Get the current scroll top value
   */
  getScrollTop() {
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
  positionParllaxElements(elements, ratio) {
    for (let i = 0; i < elements.length; i++) {
      const thisEle = elements[i];
      const screenTop = thisEle.parentElement.getBoundingClientRect().top;
      const top = screenTop + this.getScrollTop();
      thisEle.style.top = -(top / ratio) + "px";
      thisEle.style.height = "100%";
    }
  }

  /**
   * Replace the native events with custom events
   * @param {array} elements - Array of elements to add the parallax effect to.
   * @param {number} ratio - Set the parallax constant
   */
  customEvent(type, name, obj) {
    obj = obj || window;
    let running = false;
    const func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
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
  scrollReplace(event) {
    if (!this.responsive) {
      this.lastScrollSimulated = true;
      event.preventDefault();

      const newScrollTop = this.scrollTop + event.deltaY;

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
  scrollHandler() {
    if (this.responsive) {
      for (let i = 0; i < this.parallaxElements.length; i++) {
        const thisEle = this.parallaxElements[i];
        const parent = thisEle.parentElement;
        if (
          parent.getBoundingClientRect().top <
          document.documentElement.clientHeight + 50
        ) {
          thisEle.style.opacity = 1;
        } else {
          thisEle.style.opacity = 0;
        }
        thisEle.style.transform = "none";
      }
      return true;
    }

    for (let i = 0; i < this.parallaxElements.length; i++) {
      this.parallaxElements[i].style.opacity = 1;
      this.parallaxElements[i].style.transform =
        "translateY(" + this.scrollTop / this.pRatio + "px)";
    }
    return true;
  }

  /**
   * Handles the resize event
   */
  resizeHandler(event) {
    this.scrollTop = this.getScrollTop();
    this.scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    this.positionParllaxElements(this.parallaxElements, this.pRatio);
    this.responsive = window.innerWidth < this.breakpoint;
  }

  /**
   * Constructor function
   */
  constructor(selector, parllaxRatio, breakpoint) {
    this.breakpoint = breakpoint || 0; // Breakpoint for the mobile view
    this.pRatio = parllaxRatio; // save the parallax ratio
    this.parallaxElements = document.getElementsByClassName(selector); // cache the parallax elements

    this.responsive = window.innerWidth < this.breakpoint; // should the parallax elements display using mobile view

    this.customEvent("resize", "optimizedResize"); // init custom events
    this.customEvent("scroll", "optimizedScroll"); // init custom events

    this.scrollTop = this.getScrollTop(); // Get the current screen position

    this.scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight; // Get the current document scrollable height

    this.positionParllaxElements(this.parallaxElements, this.pRatio); // Set up the parallax elements positions

    this.lastScrollSimulated = false; // allows the scroll event listener to check if the last scroll event was simulated or native

    window.addEventListener("mousewheel", this.scrollReplace.bind(this)); // Add mousewheel listener
    window.addEventListener("wheel", this.scrollReplace.bind(this)); // Add wheel listener

    window.addEventListener("optimizedScroll", event => {
      if (this.lastScrollSimulated) {
        this.lastScrollSimulated = false;
      } else {
        this.scrollTop = this.getScrollTop();
        this.scrollHandler();
      }
    }); // Add scroll listener

    window.addEventListener("optimizedResize", this.resizeHandler.bind(this)); // Add resize listener
  }
}

(function() {
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
  window.parallaxEffect = new ParallaxEffect("parallax-moving", 2, 767);
})();