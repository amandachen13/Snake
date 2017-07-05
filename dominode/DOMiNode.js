/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

function $l (arg) {
  if (arg instanceof HTMLElement || arg === window) {
    return new DOMNodeCollection([arg]);
  } else if (typeof arg === 'string'){
    const elements = Array.from(document.querySelectorAll(arg));
    return new DOMNodeCollection(elements);
  } else if (arg instanceof Function) {
    if (document.readyState === 'complete') {
      arg();
    } else {
      if (typeof queue === 'undefined') {
        var queue = [];
        document.addEventListener('DOMContentLoaded', () => queue.forEach( fn => fn() ), false);
      }
      queue.push(arg);
    }
  }
}

$l.extend = function (defaultObj, ...objects) {
  objects.forEach( (obj) => {
    for (let key in obj) {
      defaultObj[key] = obj[key];
    }
  });
  return defaultObj;
};

$l.ajax = function(options) {
  const defaults = {
    type: 'GET',
    success: () => {},
    error: () => {},
    url: window.location.href,
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  };
  options = $l.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(options.type, options.url);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      options.success(JSON.parse(xhr.response));
    } else {
      options.error(JSON.parse(xhr.response));
    }
  };

  xhr.send(options.data);
};

window.$l = $l;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

const DOMNodeCollection = function (HTMLElements) {
  this.HTMLElements = HTMLElements;
};

DOMNodeCollection.prototype.each = function (callback) {
  this.HTMLElements.forEach ( el => callback(el) );
  return this;
};

DOMNodeCollection.prototype.select = function (i) {
  return new DOMNodeCollection([this.HTMLElements[i]]);
};

DOMNodeCollection.prototype.html = function(innerHTML) {

  if (typeof innerHTML != 'undefined') {
    this.each( el => el.innerHTML = innerHTML );
  } else {
    return this.HTMLElements[0].innerHTML;
  }
  return this;
};

DOMNodeCollection.prototype.empty = function() {
  this.html("");
  return this;
};

DOMNodeCollection.prototype.append = function (el) {
  if (typeof el === 'string') {
    this.each( e => e.innerHTML += el );
  } else if (el instanceof HTMLElement) {
    this.append(el.outerHTML);
  } else if (el instanceof DOMNodeCollection) {
    el.each( e => this.append(e) );
  }
  return this;
};

DOMNodeCollection.prototype.attr = function (name, value) {
  if (typeof value === 'undefined') {
    return this.HTMLElements[0].getAttribute(name);
  } else {
    this.each( el => el.setAttribute(name, value) );
  }
  return this;
};

DOMNodeCollection.prototype.addClass = function(value) {
  this.each( (el) => {
    if (typeof el.className === 'undefined') {
      el.className = value;
    } else {
      el.className += ` ${value}`;
    }
  });
  return this;
};

DOMNodeCollection.prototype.removeClass = function(value) {
  this.each( (el) => el.className = el.className.replace(value, "") );
  return this;
};

DOMNodeCollection.prototype.children = function () {
  let childrenEls = [];
  this.each( el => childrenEls = childrenEls.concat(Array.from(el.children)));
  return new DOMNodeCollection(childrenEls);
};

DOMNodeCollection.prototype.parent = function () {
  let parentEls = [];
  this.each( el => parentEls.push(el.parentNode));
  parentEls = [...new Set(parentEls)];
  return new DOMNodeCollection(parentEls);
};

DOMNodeCollection.prototype.find = function (selector) {
  let matching = [];
  this.each( el => matching = matching.concat(Array.from(el.querySelectorAll(selector) ) ) );
  return new DOMNodeCollection(matching);
};

DOMNodeCollection.prototype.remove = function() {
  this.each((el) => el.outerHTML = '');
  this.HTMLElements = [];
  return this;
};

DOMNodeCollection.prototype.on = function (eventType, callback) {
  this.each( el => {
    el.addEventListener(eventType, callback);
    if (typeof el.events === 'undefined') el.events = {};
    if (typeof el.events[eventType] === 'undefined') el.events[eventType] = [];
    el.events[eventType].push(callback);
  });
  return this;
};

DOMNodeCollection.prototype.off = function (eventType) {
  this.each( el => {
    if ( !el.events || !el.events[eventType] ) return;
    el.events[eventType].forEach( handler => {
      el.removeEventListener(eventType, handler);
    });
    el.events[eventType] = [];
  });
  return this;
};

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);
