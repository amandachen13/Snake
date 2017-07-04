const DOMNodeCollection = function (HTMLElements) {
  this.HTMLElements = HTMLElements;
};

DOMNodeCollection.prototype.each = function (callback) {
  this.HTMLElements.forEach ( el => callback(el) );
  return this;
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
