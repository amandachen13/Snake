const DOMNodeCollection = require('./dom_node_collection.js');

function $l (arg) {
  if (arg instanceof HTMLElement) {
    return new DOMNodeCollection([arg]);
  } else if ( typeof arg === 'string'){
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
