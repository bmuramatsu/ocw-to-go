"use strict";
(() => {
  // node_modules/workbox-core/_version.js
  try {
    self["workbox:core:7.0.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-core/models/messages/messages.js
  var messages = {
    "invalid-value": ({ paramName, validValueDescription, value }) => {
      if (!paramName || !validValueDescription) {
        throw new Error(`Unexpected input to 'invalid-value' error.`);
      }
      return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
    },
    "not-an-array": ({ moduleName, className, funcName, paramName }) => {
      if (!moduleName || !className || !funcName || !paramName) {
        throw new Error(`Unexpected input to 'not-an-array' error.`);
      }
      return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
    },
    "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
      if (!expectedType || !paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'incorrect-type' error.`);
      }
      const classNameStr = className ? `${className}.` : "";
      return `The parameter '${paramName}' passed into '${moduleName}.${classNameStr}${funcName}()' must be of type ${expectedType}.`;
    },
    "incorrect-class": ({ expectedClassName, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
      if (!expectedClassName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'incorrect-class' error.`);
      }
      const classNameStr = className ? `${className}.` : "";
      if (isReturnValueProblem) {
        return `The return value from '${moduleName}.${classNameStr}${funcName}()' must be an instance of class ${expectedClassName}.`;
      }
      return `The parameter '${paramName}' passed into '${moduleName}.${classNameStr}${funcName}()' must be an instance of class ${expectedClassName}.`;
    },
    "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
      if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
        throw new Error(`Unexpected input to 'missing-a-method' error.`);
      }
      return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
    },
    "add-to-cache-list-unexpected-type": ({ entry }) => {
      return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
    },
    "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
      if (!firstEntry || !secondEntry) {
        throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
      }
      return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
    },
    "plugin-error-request-will-fetch": ({ thrownErrorMessage }) => {
      if (!thrownErrorMessage) {
        throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
      }
      return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownErrorMessage}'.`;
    },
    "invalid-cache-name": ({ cacheNameId, value }) => {
      if (!cacheNameId) {
        throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
      }
      return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
    },
    "unregister-route-but-not-found-with-method": ({ method }) => {
      if (!method) {
        throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
      }
      return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
    },
    "unregister-route-route-not-registered": () => {
      return `The route you're trying to unregister was not previously registered.`;
    },
    "queue-replay-failed": ({ name }) => {
      return `Replaying the background sync queue '${name}' failed.`;
    },
    "duplicate-queue-name": ({ name }) => {
      return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
    },
    "expired-test-without-max-age": ({ methodName, paramName }) => {
      return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
    },
    "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
      return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
    },
    "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
      return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
    },
    "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
      return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
    },
    "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
      return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
    },
    "invalid-string": ({ moduleName, funcName, paramName }) => {
      if (!paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'invalid-string' error.`);
      }
      return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
    },
    "channel-name-required": () => {
      return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
    },
    "invalid-responses-are-same-args": () => {
      return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
    },
    "expire-custom-caches-only": () => {
      return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
    },
    "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
      }
      return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
    },
    "single-range-only": ({ normalizedRangeHeader }) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'single-range-only' error.`);
      }
      return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
    },
    "invalid-range-values": ({ normalizedRangeHeader }) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'invalid-range-values' error.`);
      }
      return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
    },
    "no-range-header": () => {
      return `No Range header was found in the Request provided.`;
    },
    "range-not-satisfiable": ({ size, start, end }) => {
      return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
    },
    "attempt-to-cache-non-get-request": ({ url, method }) => {
      return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
    },
    "cache-put-with-no-response": ({ url }) => {
      return `There was an attempt to cache '${url}' but the response was not defined.`;
    },
    "no-response": ({ url, error }) => {
      let message = `The strategy could not generate a response for '${url}'.`;
      if (error) {
        message += ` The underlying error is ${error}.`;
      }
      return message;
    },
    "bad-precaching-response": ({ url, status }) => {
      return `The precaching request for '${url}' failed` + (status ? ` with an HTTP status of ${status}.` : `.`);
    },
    "non-precached-url": ({ url }) => {
      return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
    },
    "add-to-cache-list-conflicting-integrities": ({ url }) => {
      return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
    },
    "missing-precache-entry": ({ cacheName, url }) => {
      return `Unable to find a precached response in ${cacheName} for ${url}.`;
    },
    "cross-origin-copy-response": ({ origin }) => {
      return `workbox-core.copyResponse() can only be used with same-origin responses. It was passed a response with origin ${origin}.`;
    },
    "opaque-streams-source": ({ type }) => {
      const message = `One of the workbox-streams sources resulted in an '${type}' response.`;
      if (type === "opaqueredirect") {
        return `${message} Please do not use a navigation request that results in a redirect as a source.`;
      }
      return `${message} Please ensure your sources are CORS-enabled.`;
    }
  };

  // node_modules/workbox-core/models/messages/messageGenerator.js
  var generatorFunction = (code, details = {}) => {
    const message = messages[code];
    if (!message) {
      throw new Error(`Unable to find message for code '${code}'.`);
    }
    return message(details);
  };
  var messageGenerator = false ? fallback : generatorFunction;

  // node_modules/workbox-core/_private/WorkboxError.js
  var WorkboxError = class extends Error {
    /**
     *
     * @param {string} errorCode The error code that
     * identifies this particular error.
     * @param {Object=} details Any relevant arguments
     * that will help developers identify issues should
     * be added as a key on the context object.
     */
    constructor(errorCode, details) {
      const message = messageGenerator(errorCode, details);
      super(message);
      this.name = errorCode;
      this.details = details;
    }
  };

  // node_modules/workbox-core/_private/assert.js
  var isArray = (value, details) => {
    if (!Array.isArray(value)) {
      throw new WorkboxError("not-an-array", details);
    }
  };
  var hasMethod = (object, expectedMethod, details) => {
    const type = typeof object[expectedMethod];
    if (type !== "function") {
      details["expectedMethod"] = expectedMethod;
      throw new WorkboxError("missing-a-method", details);
    }
  };
  var isType = (object, expectedType, details) => {
    if (typeof object !== expectedType) {
      details["expectedType"] = expectedType;
      throw new WorkboxError("incorrect-type", details);
    }
  };
  var isInstance = (object, expectedClass, details) => {
    if (!(object instanceof expectedClass)) {
      details["expectedClassName"] = expectedClass.name;
      throw new WorkboxError("incorrect-class", details);
    }
  };
  var isOneOf = (value, validValues, details) => {
    if (!validValues.includes(value)) {
      details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
      throw new WorkboxError("invalid-value", details);
    }
  };
  var isArrayOfClass = (value, expectedClass, details) => {
    const error = new WorkboxError("not-array-of-class", details);
    if (!Array.isArray(value)) {
      throw error;
    }
    for (const item of value) {
      if (!(item instanceof expectedClass)) {
        throw error;
      }
    }
  };
  var finalAssertExports = false ? null : {
    hasMethod,
    isArray,
    isInstance,
    isOneOf,
    isType,
    isArrayOfClass
  };

  // node_modules/workbox-core/_private/logger.js
  var logger = false ? null : (() => {
    if (!("__WB_DISABLE_DEV_LOGS" in globalThis)) {
      self.__WB_DISABLE_DEV_LOGS = false;
    }
    let inGroup = false;
    const methodToColorMap = {
      debug: `#7f8c8d`,
      log: `#2ecc71`,
      warn: `#f39c12`,
      error: `#c0392b`,
      groupCollapsed: `#3498db`,
      groupEnd: null
      // No colored prefix on groupEnd
    };
    const print = function(method, args) {
      if (self.__WB_DISABLE_DEV_LOGS) {
        return;
      }
      if (method === "groupCollapsed") {
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          console[method](...args);
          return;
        }
      }
      const styles = [
        `background: ${methodToColorMap[method]}`,
        `border-radius: 0.5em`,
        `color: white`,
        `font-weight: bold`,
        `padding: 2px 0.5em`
      ];
      const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
      console[method](...logPrefix, ...args);
      if (method === "groupCollapsed") {
        inGroup = true;
      }
      if (method === "groupEnd") {
        inGroup = false;
      }
    };
    const api = {};
    const loggerMethods = Object.keys(methodToColorMap);
    for (const key of loggerMethods) {
      const method = key;
      api[method] = (...args) => {
        print(method, args);
      };
    }
    return api;
  })();

  // node_modules/workbox-range-requests/_version.js
  try {
    self["workbox:range-requests:7.0.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-range-requests/utils/calculateEffectiveBoundaries.js
  function calculateEffectiveBoundaries(blob, start, end) {
    if (true) {
      finalAssertExports.isInstance(blob, Blob, {
        moduleName: "workbox-range-requests",
        funcName: "calculateEffectiveBoundaries",
        paramName: "blob"
      });
    }
    const blobSize = blob.size;
    if (end && end > blobSize || start && start < 0) {
      throw new WorkboxError("range-not-satisfiable", {
        size: blobSize,
        end,
        start
      });
    }
    let effectiveStart;
    let effectiveEnd;
    if (start !== void 0 && end !== void 0) {
      effectiveStart = start;
      effectiveEnd = end + 1;
    } else if (start !== void 0 && end === void 0) {
      effectiveStart = start;
      effectiveEnd = blobSize;
    } else if (end !== void 0 && start === void 0) {
      effectiveStart = blobSize - end;
      effectiveEnd = blobSize;
    }
    return {
      start: effectiveStart,
      end: effectiveEnd
    };
  }

  // node_modules/workbox-range-requests/utils/parseRangeHeader.js
  function parseRangeHeader(rangeHeader) {
    if (true) {
      finalAssertExports.isType(rangeHeader, "string", {
        moduleName: "workbox-range-requests",
        funcName: "parseRangeHeader",
        paramName: "rangeHeader"
      });
    }
    const normalizedRangeHeader = rangeHeader.trim().toLowerCase();
    if (!normalizedRangeHeader.startsWith("bytes=")) {
      throw new WorkboxError("unit-must-be-bytes", { normalizedRangeHeader });
    }
    if (normalizedRangeHeader.includes(",")) {
      throw new WorkboxError("single-range-only", { normalizedRangeHeader });
    }
    const rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
    if (!rangeParts || !(rangeParts[1] || rangeParts[2])) {
      throw new WorkboxError("invalid-range-values", { normalizedRangeHeader });
    }
    return {
      start: rangeParts[1] === "" ? void 0 : Number(rangeParts[1]),
      end: rangeParts[2] === "" ? void 0 : Number(rangeParts[2])
    };
  }

  // node_modules/workbox-range-requests/createPartialResponse.js
  async function createPartialResponse(request, originalResponse) {
    try {
      if (true) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-range-requests",
          funcName: "createPartialResponse",
          paramName: "request"
        });
        finalAssertExports.isInstance(originalResponse, Response, {
          moduleName: "workbox-range-requests",
          funcName: "createPartialResponse",
          paramName: "originalResponse"
        });
      }
      if (originalResponse.status === 206) {
        return originalResponse;
      }
      const rangeHeader = request.headers.get("range");
      if (!rangeHeader) {
        throw new WorkboxError("no-range-header");
      }
      const boundaries = parseRangeHeader(rangeHeader);
      const originalBlob = await originalResponse.blob();
      const effectiveBoundaries = calculateEffectiveBoundaries(originalBlob, boundaries.start, boundaries.end);
      const slicedBlob = originalBlob.slice(effectiveBoundaries.start, effectiveBoundaries.end);
      const slicedBlobSize = slicedBlob.size;
      const slicedResponse = new Response(slicedBlob, {
        // Status code 206 is for a Partial Content response.
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
        status: 206,
        statusText: "Partial Content",
        headers: originalResponse.headers
      });
      slicedResponse.headers.set("Content-Length", String(slicedBlobSize));
      slicedResponse.headers.set("Content-Range", `bytes ${effectiveBoundaries.start}-${effectiveBoundaries.end - 1}/${originalBlob.size}`);
      return slicedResponse;
    } catch (error) {
      if (true) {
        logger.warn(`Unable to construct a partial response; returning a 416 Range Not Satisfiable response instead.`);
        logger.groupCollapsed(`View details here.`);
        logger.log(error);
        logger.log(request);
        logger.log(originalResponse);
        logger.groupEnd();
      }
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable"
      });
    }
  }

  // node_modules/async/dist/async.mjs
  function initialParams(fn) {
    return function(...args) {
      var callback = args.pop();
      return fn.call(this, args, callback);
    };
  }
  var hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
  var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
  var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
  function fallback(fn) {
    setTimeout(fn, 0);
  }
  function wrap(defer) {
    return (fn, ...args) => defer(() => fn(...args));
  }
  var _defer$1;
  if (hasQueueMicrotask) {
    _defer$1 = queueMicrotask;
  } else if (hasSetImmediate) {
    _defer$1 = setImmediate;
  } else if (hasNextTick) {
    _defer$1 = process.nextTick;
  } else {
    _defer$1 = fallback;
  }
  var setImmediate$1 = wrap(_defer$1);
  function asyncify(func) {
    if (isAsync(func)) {
      return function(...args) {
        const callback = args.pop();
        const promise = func.apply(this, args);
        return handlePromise(promise, callback);
      };
    }
    return initialParams(function(args, callback) {
      var result;
      try {
        result = func.apply(this, args);
      } catch (e) {
        return callback(e);
      }
      if (result && typeof result.then === "function") {
        return handlePromise(result, callback);
      } else {
        callback(null, result);
      }
    });
  }
  function handlePromise(promise, callback) {
    return promise.then((value) => {
      invokeCallback(callback, null, value);
    }, (err) => {
      invokeCallback(callback, err && (err instanceof Error || err.message) ? err : new Error(err));
    });
  }
  function invokeCallback(callback, error, value) {
    try {
      callback(error, value);
    } catch (err) {
      setImmediate$1((e) => {
        throw e;
      }, err);
    }
  }
  function isAsync(fn) {
    return fn[Symbol.toStringTag] === "AsyncFunction";
  }
  function isAsyncGenerator(fn) {
    return fn[Symbol.toStringTag] === "AsyncGenerator";
  }
  function isAsyncIterable(obj) {
    return typeof obj[Symbol.asyncIterator] === "function";
  }
  function wrapAsync(asyncFn) {
    if (typeof asyncFn !== "function") throw new Error("expected a function");
    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
  }
  function awaitify(asyncFn, arity) {
    if (!arity) arity = asyncFn.length;
    if (!arity) throw new Error("arity is undefined");
    function awaitable(...args) {
      if (typeof args[arity - 1] === "function") {
        return asyncFn.apply(this, args);
      }
      return new Promise((resolve, reject2) => {
        args[arity - 1] = (err, ...cbArgs) => {
          if (err) return reject2(err);
          resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
        };
        asyncFn.apply(this, args);
      });
    }
    return awaitable;
  }
  function applyEach$1(eachfn) {
    return function applyEach2(fns, ...callArgs) {
      const go = awaitify(function(callback) {
        var that = this;
        return eachfn(fns, (fn, cb) => {
          wrapAsync(fn).apply(that, callArgs.concat(cb));
        }, callback);
      });
      return go;
    };
  }
  function _asyncMap(eachfn, arr, iteratee, callback) {
    arr = arr || [];
    var results = [];
    var counter = 0;
    var _iteratee = wrapAsync(iteratee);
    return eachfn(arr, (value, _2, iterCb) => {
      var index = counter++;
      _iteratee(value, (err, v) => {
        results[index] = v;
        iterCb(err);
      });
    }, (err) => {
      callback(err, results);
    });
  }
  function isArrayLike(value) {
    return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
  }
  var breakLoop = {};
  function once(fn) {
    function wrapper(...args) {
      if (fn === null) return;
      var callFn = fn;
      fn = null;
      callFn.apply(this, args);
    }
    Object.assign(wrapper, fn);
    return wrapper;
  }
  function getIterator(coll) {
    return coll[Symbol.iterator] && coll[Symbol.iterator]();
  }
  function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
      return ++i < len ? { value: coll[i], key: i } : null;
    };
  }
  function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
      var item = iterator.next();
      if (item.done)
        return null;
      i++;
      return { value: item.value, key: i };
    };
  }
  function createObjectIterator(obj) {
    var okeys = obj ? Object.keys(obj) : [];
    var i = -1;
    var len = okeys.length;
    return function next() {
      var key = okeys[++i];
      if (key === "__proto__") {
        return next();
      }
      return i < len ? { value: obj[key], key } : null;
    };
  }
  function createIterator(coll) {
    if (isArrayLike(coll)) {
      return createArrayIterator(coll);
    }
    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
  }
  function onlyOnce(fn) {
    return function(...args) {
      if (fn === null) throw new Error("Callback was already called.");
      var callFn = fn;
      fn = null;
      callFn.apply(this, args);
    };
  }
  function asyncEachOfLimit(generator, limit, iteratee, callback) {
    let done = false;
    let canceled = false;
    let awaiting = false;
    let running = 0;
    let idx = 0;
    function replenish() {
      if (running >= limit || awaiting || done) return;
      awaiting = true;
      generator.next().then(({ value, done: iterDone }) => {
        if (canceled || done) return;
        awaiting = false;
        if (iterDone) {
          done = true;
          if (running <= 0) {
            callback(null);
          }
          return;
        }
        running++;
        iteratee(value, idx, iterateeCallback);
        idx++;
        replenish();
      }).catch(handleError);
    }
    function iterateeCallback(err, result) {
      running -= 1;
      if (canceled) return;
      if (err) return handleError(err);
      if (err === false) {
        done = true;
        canceled = true;
        return;
      }
      if (result === breakLoop || done && running <= 0) {
        done = true;
        return callback(null);
      }
      replenish();
    }
    function handleError(err) {
      if (canceled) return;
      awaiting = false;
      done = true;
      callback(err);
    }
    replenish();
  }
  var eachOfLimit$2 = (limit) => {
    return (obj, iteratee, callback) => {
      callback = once(callback);
      if (limit <= 0) {
        throw new RangeError("concurrency limit cannot be less than 1");
      }
      if (!obj) {
        return callback(null);
      }
      if (isAsyncGenerator(obj)) {
        return asyncEachOfLimit(obj, limit, iteratee, callback);
      }
      if (isAsyncIterable(obj)) {
        return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
      }
      var nextElem = createIterator(obj);
      var done = false;
      var canceled = false;
      var running = 0;
      var looping = false;
      function iterateeCallback(err, value) {
        if (canceled) return;
        running -= 1;
        if (err) {
          done = true;
          callback(err);
        } else if (err === false) {
          done = true;
          canceled = true;
        } else if (value === breakLoop || done && running <= 0) {
          done = true;
          return callback(null);
        } else if (!looping) {
          replenish();
        }
      }
      function replenish() {
        looping = true;
        while (running < limit && !done) {
          var elem = nextElem();
          if (elem === null) {
            done = true;
            if (running <= 0) {
              callback(null);
            }
            return;
          }
          running += 1;
          iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
        }
        looping = false;
      }
      replenish();
    };
  };
  function eachOfLimit(coll, limit, iteratee, callback) {
    return eachOfLimit$2(limit)(coll, wrapAsync(iteratee), callback);
  }
  var eachOfLimit$1 = awaitify(eachOfLimit, 4);
  function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback);
    var index = 0, completed = 0, { length } = coll, canceled = false;
    if (length === 0) {
      callback(null);
    }
    function iteratorCallback(err, value) {
      if (err === false) {
        canceled = true;
      }
      if (canceled === true) return;
      if (err) {
        callback(err);
      } else if (++completed === length || value === breakLoop) {
        callback(null);
      }
    }
    for (; index < length; index++) {
      iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
  }
  function eachOfGeneric(coll, iteratee, callback) {
    return eachOfLimit$1(coll, Infinity, iteratee, callback);
  }
  function eachOf(coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    return eachOfImplementation(coll, wrapAsync(iteratee), callback);
  }
  var eachOf$1 = awaitify(eachOf, 3);
  function map(coll, iteratee, callback) {
    return _asyncMap(eachOf$1, coll, iteratee, callback);
  }
  var map$1 = awaitify(map, 3);
  var applyEach = applyEach$1(map$1);
  function eachOfSeries(coll, iteratee, callback) {
    return eachOfLimit$1(coll, 1, iteratee, callback);
  }
  var eachOfSeries$1 = awaitify(eachOfSeries, 3);
  function mapSeries(coll, iteratee, callback) {
    return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
  }
  var mapSeries$1 = awaitify(mapSeries, 3);
  var applyEachSeries = applyEach$1(mapSeries$1);
  var PROMISE_SYMBOL = Symbol("promiseCallback");
  function reduce(coll, memo, iteratee, callback) {
    callback = once(callback);
    var _iteratee = wrapAsync(iteratee);
    return eachOfSeries$1(coll, (x, i, iterCb) => {
      _iteratee(memo, x, (err, v) => {
        memo = v;
        iterCb(err);
      });
    }, (err) => callback(err, memo));
  }
  var reduce$1 = awaitify(reduce, 4);
  function mapLimit(coll, limit, iteratee, callback) {
    return _asyncMap(eachOfLimit$2(limit), coll, iteratee, callback);
  }
  var mapLimit$1 = awaitify(mapLimit, 4);
  function concatLimit(coll, limit, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);
    return mapLimit$1(coll, limit, (val, iterCb) => {
      _iteratee(val, (err, ...args) => {
        if (err) return iterCb(err);
        return iterCb(err, args);
      });
    }, (err, mapResults) => {
      var result = [];
      for (var i = 0; i < mapResults.length; i++) {
        if (mapResults[i]) {
          result = result.concat(...mapResults[i]);
        }
      }
      return callback(err, result);
    });
  }
  var concatLimit$1 = awaitify(concatLimit, 4);
  function concat(coll, iteratee, callback) {
    return concatLimit$1(coll, Infinity, iteratee, callback);
  }
  var concat$1 = awaitify(concat, 3);
  function concatSeries(coll, iteratee, callback) {
    return concatLimit$1(coll, 1, iteratee, callback);
  }
  var concatSeries$1 = awaitify(concatSeries, 3);
  function _createTester(check, getResult) {
    return (eachfn, arr, _iteratee, cb) => {
      var testPassed = false;
      var testResult;
      const iteratee = wrapAsync(_iteratee);
      eachfn(arr, (value, _2, callback) => {
        iteratee(value, (err, result) => {
          if (err || err === false) return callback(err);
          if (check(result) && !testResult) {
            testPassed = true;
            testResult = getResult(true, value);
            return callback(null, breakLoop);
          }
          callback();
        });
      }, (err) => {
        if (err) return cb(err);
        cb(null, testPassed ? testResult : getResult(false));
      });
    };
  }
  function detect(coll, iteratee, callback) {
    return _createTester((bool) => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
  }
  var detect$1 = awaitify(detect, 3);
  function detectLimit(coll, limit, iteratee, callback) {
    return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(limit), coll, iteratee, callback);
  }
  var detectLimit$1 = awaitify(detectLimit, 4);
  function detectSeries(coll, iteratee, callback) {
    return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(1), coll, iteratee, callback);
  }
  var detectSeries$1 = awaitify(detectSeries, 3);
  function consoleFunc(name) {
    return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
      if (typeof console === "object") {
        if (err) {
          if (console.error) {
            console.error(err);
          }
        } else if (console[name]) {
          resultArgs.forEach((x) => console[name](x));
        }
      }
    });
  }
  var dir = consoleFunc("dir");
  function doWhilst(iteratee, test, callback) {
    callback = onlyOnce(callback);
    var _fn = wrapAsync(iteratee);
    var _test = wrapAsync(test);
    var results;
    function next(err, ...args) {
      if (err) return callback(err);
      if (err === false) return;
      results = args;
      _test(...args, check);
    }
    function check(err, truth) {
      if (err) return callback(err);
      if (err === false) return;
      if (!truth) return callback(null, ...results);
      _fn(next);
    }
    return check(null, true);
  }
  var doWhilst$1 = awaitify(doWhilst, 3);
  function _withoutIndex(iteratee) {
    return (value, index, callback) => iteratee(value, callback);
  }
  function eachLimit$2(coll, iteratee, callback) {
    return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
  }
  var each = awaitify(eachLimit$2, 3);
  function eachLimit(coll, limit, iteratee, callback) {
    return eachOfLimit$2(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
  }
  var eachLimit$1 = awaitify(eachLimit, 4);
  function eachSeries(coll, iteratee, callback) {
    return eachLimit$1(coll, 1, iteratee, callback);
  }
  var eachSeries$1 = awaitify(eachSeries, 3);
  function ensureAsync(fn) {
    if (isAsync(fn)) return fn;
    return function(...args) {
      var callback = args.pop();
      var sync = true;
      args.push((...innerArgs) => {
        if (sync) {
          setImmediate$1(() => callback(...innerArgs));
        } else {
          callback(...innerArgs);
        }
      });
      fn.apply(this, args);
      sync = false;
    };
  }
  function every(coll, iteratee, callback) {
    return _createTester((bool) => !bool, (res) => !res)(eachOf$1, coll, iteratee, callback);
  }
  var every$1 = awaitify(every, 3);
  function everyLimit(coll, limit, iteratee, callback) {
    return _createTester((bool) => !bool, (res) => !res)(eachOfLimit$2(limit), coll, iteratee, callback);
  }
  var everyLimit$1 = awaitify(everyLimit, 4);
  function everySeries(coll, iteratee, callback) {
    return _createTester((bool) => !bool, (res) => !res)(eachOfSeries$1, coll, iteratee, callback);
  }
  var everySeries$1 = awaitify(everySeries, 3);
  function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, (x, index, iterCb) => {
      iteratee(x, (err, v) => {
        truthValues[index] = !!v;
        iterCb(err);
      });
    }, (err) => {
      if (err) return callback(err);
      var results = [];
      for (var i = 0; i < arr.length; i++) {
        if (truthValues[i]) results.push(arr[i]);
      }
      callback(null, results);
    });
  }
  function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, (x, index, iterCb) => {
      iteratee(x, (err, v) => {
        if (err) return iterCb(err);
        if (v) {
          results.push({ index, value: x });
        }
        iterCb(err);
      });
    }, (err) => {
      if (err) return callback(err);
      callback(null, results.sort((a, b) => a.index - b.index).map((v) => v.value));
    });
  }
  function _filter(eachfn, coll, iteratee, callback) {
    var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
    return filter2(eachfn, coll, wrapAsync(iteratee), callback);
  }
  function filter(coll, iteratee, callback) {
    return _filter(eachOf$1, coll, iteratee, callback);
  }
  var filter$1 = awaitify(filter, 3);
  function filterLimit(coll, limit, iteratee, callback) {
    return _filter(eachOfLimit$2(limit), coll, iteratee, callback);
  }
  var filterLimit$1 = awaitify(filterLimit, 4);
  function filterSeries(coll, iteratee, callback) {
    return _filter(eachOfSeries$1, coll, iteratee, callback);
  }
  var filterSeries$1 = awaitify(filterSeries, 3);
  function forever(fn, errback) {
    var done = onlyOnce(errback);
    var task = wrapAsync(ensureAsync(fn));
    function next(err) {
      if (err) return done(err);
      if (err === false) return;
      task(next);
    }
    return next();
  }
  var forever$1 = awaitify(forever, 2);
  function groupByLimit(coll, limit, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);
    return mapLimit$1(coll, limit, (val, iterCb) => {
      _iteratee(val, (err, key) => {
        if (err) return iterCb(err);
        return iterCb(err, { key, val });
      });
    }, (err, mapResults) => {
      var result = {};
      var { hasOwnProperty } = Object.prototype;
      for (var i = 0; i < mapResults.length; i++) {
        if (mapResults[i]) {
          var { key } = mapResults[i];
          var { val } = mapResults[i];
          if (hasOwnProperty.call(result, key)) {
            result[key].push(val);
          } else {
            result[key] = [val];
          }
        }
      }
      return callback(err, result);
    });
  }
  var groupByLimit$1 = awaitify(groupByLimit, 4);
  var log = consoleFunc("log");
  function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback);
    var newObj = {};
    var _iteratee = wrapAsync(iteratee);
    return eachOfLimit$2(limit)(obj, (val, key, next) => {
      _iteratee(val, key, (err, result) => {
        if (err) return next(err);
        newObj[key] = result;
        next(err);
      });
    }, (err) => callback(err, newObj));
  }
  var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);
  var _defer;
  if (hasNextTick) {
    _defer = process.nextTick;
  } else if (hasSetImmediate) {
    _defer = setImmediate;
  } else {
    _defer = fallback;
  }
  var nextTick = wrap(_defer);
  var _parallel = awaitify((eachfn, tasks, callback) => {
    var results = isArrayLike(tasks) ? [] : {};
    eachfn(tasks, (task, key, taskCb) => {
      wrapAsync(task)((err, ...result) => {
        if (result.length < 2) {
          [result] = result;
        }
        results[key] = result;
        taskCb(err);
      });
    }, (err) => callback(err, results));
  }, 3);
  function race(tasks, callback) {
    callback = once(callback);
    if (!Array.isArray(tasks)) return callback(new TypeError("First argument to race must be an array of functions"));
    if (!tasks.length) return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
      wrapAsync(tasks[i])(callback);
    }
  }
  var race$1 = awaitify(race, 2);
  function reject$2(eachfn, arr, _iteratee, callback) {
    const iteratee = wrapAsync(_iteratee);
    return _filter(eachfn, arr, (value, cb) => {
      iteratee(value, (err, v) => {
        cb(err, !v);
      });
    }, callback);
  }
  function reject(coll, iteratee, callback) {
    return reject$2(eachOf$1, coll, iteratee, callback);
  }
  var reject$1 = awaitify(reject, 3);
  function rejectLimit(coll, limit, iteratee, callback) {
    return reject$2(eachOfLimit$2(limit), coll, iteratee, callback);
  }
  var rejectLimit$1 = awaitify(rejectLimit, 4);
  function rejectSeries(coll, iteratee, callback) {
    return reject$2(eachOfSeries$1, coll, iteratee, callback);
  }
  var rejectSeries$1 = awaitify(rejectSeries, 3);
  function some(coll, iteratee, callback) {
    return _createTester(Boolean, (res) => res)(eachOf$1, coll, iteratee, callback);
  }
  var some$1 = awaitify(some, 3);
  function someLimit(coll, limit, iteratee, callback) {
    return _createTester(Boolean, (res) => res)(eachOfLimit$2(limit), coll, iteratee, callback);
  }
  var someLimit$1 = awaitify(someLimit, 4);
  function someSeries(coll, iteratee, callback) {
    return _createTester(Boolean, (res) => res)(eachOfSeries$1, coll, iteratee, callback);
  }
  var someSeries$1 = awaitify(someSeries, 3);
  function sortBy(coll, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);
    return map$1(coll, (x, iterCb) => {
      _iteratee(x, (err, criteria) => {
        if (err) return iterCb(err);
        iterCb(err, { value: x, criteria });
      });
    }, (err, results) => {
      if (err) return callback(err);
      callback(null, results.sort(comparator).map((v) => v.value));
    });
    function comparator(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }
  var sortBy$1 = awaitify(sortBy, 3);
  function tryEach(tasks, callback) {
    var error = null;
    var result;
    return eachSeries$1(tasks, (task, taskCb) => {
      wrapAsync(task)((err, ...args) => {
        if (err === false) return taskCb(err);
        if (args.length < 2) {
          [result] = args;
        } else {
          result = args;
        }
        error = err;
        taskCb(err ? null : {});
      });
    }, () => callback(error, result));
  }
  var tryEach$1 = awaitify(tryEach);
  function whilst(test, iteratee, callback) {
    callback = onlyOnce(callback);
    var _fn = wrapAsync(iteratee);
    var _test = wrapAsync(test);
    var results = [];
    function next(err, ...rest) {
      if (err) return callback(err);
      results = rest;
      if (err === false) return;
      _test(check);
    }
    function check(err, truth) {
      if (err) return callback(err);
      if (err === false) return;
      if (!truth) return callback(null, ...results);
      _fn(next);
    }
    return _test(check);
  }
  var whilst$1 = awaitify(whilst, 3);
  function waterfall(tasks, callback) {
    callback = once(callback);
    if (!Array.isArray(tasks)) return callback(new Error("First argument to waterfall must be an array of functions"));
    if (!tasks.length) return callback();
    var taskIndex = 0;
    function nextTask(args) {
      var task = wrapAsync(tasks[taskIndex++]);
      task(...args, onlyOnce(next));
    }
    function next(err, ...args) {
      if (err === false) return;
      if (err || taskIndex === tasks.length) {
        return callback(err, ...args);
      }
      nextTask(args);
    }
    nextTask([]);
  }
  var waterfall$1 = awaitify(waterfall);

  // src/app/initial_course_list.ts
  var ASSET_HOST = "https://mit-ocw-courses.atomicjoltdevapps.com";
  var VIDEO_HOST = "https://ocw.mit.edu/courses";
  var ALL_COURSES = [
    {
      id: "course-10",
      name: "Introduction to CS and Programming using Python",
      file: ASSET_HOST + "/intro-to-cs-01.zip",
      status: "",
      ready: false,
      videos: [
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-1-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-2-multi-version-4_1_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-3-multi_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-4-multi_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-5-multi_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-6-multi-version-3_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-7-multi_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-8-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-9-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-10-version-3_1_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-11-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-12-multi-version-4_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-13-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-14-multi_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-15-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-16-multi-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-17-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-18-multi-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-19-multi-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-20-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-21-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-22-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-23-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-24-version-2_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-25-multi_360p_16_9.mp4",
        VIDEO_HOST + "/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-26-multi_360p_16_9.mp4"
      ],
      cardImg: "/images/intro-to-cs.jpg",
      courseLevel: "6.100L | Undergraduate",
      instructors: ["Dr. Ana Bell"],
      topics: ["Engineering", "Computer Science", "Programming Languages"]
    },
    {
      id: "course-11",
      name: "Kanji Learning Any Time, Any Place for Japanese V",
      file: ASSET_HOST + "/japanese-5.zip",
      status: "",
      ready: false,
      videos: [],
      cardImg: "/images/kanji-v.jpg",
      courseLevel: "RES.21G-505 | Undergraduate",
      instructors: ["Dr. Takako Aikawa", "Dr. Meghan Perdue"],
      topics: ["Humanities", "Language", "Japanese"]
    },
    {
      id: "course-12",
      name: "Kanji Learning Any Time, Any Place for Japanese VI",
      file: ASSET_HOST + "/japanese-6.zip",
      status: "",
      ready: false,
      videos: [],
      cardImg: "/images/kanji-vi.jpg",
      courseLevel: "RES.21G-506 | Undergraduate",
      instructors: ["Dr. Takako Aikawa", "Dr. Meghan Perdue"],
      topics: ["Humanities", "Language", "Japanese"]
    },
    {
      id: "course-13",
      name: "Linear Algebra",
      file: ASSET_HOST + "/linear-algebra.zip",
      status: "",
      ready: false,
      videos: [],
      cardImg: "/images/linear-algebra.jpg",
      courseLevel: "18.06SC | Undergraduate",
      instructors: ["Prof. Gilbert Strang"],
      topics: ["Mathematics", "Linear Algebra"]
    },
    {
      id: "course-14",
      name: "Introduction to Computer Science and Programming in Python",
      file: ASSET_HOST + "/intro-to-cs-2.zip",
      status: "",
      ready: false,
      videos: [],
      cardImg: "/images/intro-to-cs2.jpg",
      courseLevel: "6.0001 | Undergraduate",
      instructors: ["Dr. Ana Bell", "Prof. Eric Grimson", "Prof. John Guttag"],
      topics: ["Engineering", "Computer Science", "Programming Languages"]
    },
    {
      id: "course-15",
      name: "Creole Languages and Caribbean Identities",
      file: ASSET_HOST + "/creole.zip",
      status: "",
      ready: false,
      videos: [],
      cardImg: "/images/creole.jpg",
      courseLevel: "24.908 | Undergraduate",
      instructors: ["Prof. Michel DeGraff"],
      topics: ["Humanities", "Linguistics", "Society"]
    }
  ];

  // src/worker/assets.ts
  var ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/favicon.ico",
    "/styles.css",
    "/app.js",
    "/course.js",
    "/manifest.json",
    "/icons/android/launchericon-192-192.png",
    "/icons/android/launchericon-512-512.png",
    "/images/facebook-icon.png",
    "/images/instagram-icon.png",
    "/images/x-icon.png",
    "/images/youtube-icon.png",
    "/images/mit-logo-sm.svg",
    "/images/oeglobal.png",
    "/images/linkedin-icon.png",
    "/images/mit-logo.svg",
    ...ALL_COURSES.map((course) => course.cardImg)
  ];
  var assets_default = ASSETS_TO_CACHE;

  // src/worker.ts
  console.log("The Worker Ran");
  var VERSION = "v1";
  console.log("VERSION " + VERSION);
  self.addEventListener("install", (event) => {
    console.log("The Worker Installed", event);
    event.waitUntil((async () => {
      const cache = await caches.open("pwa-assets");
      await cache.addAll(assets_default);
    })());
    self.skipWaiting();
  });
  self.addEventListener("activate", (event) => {
    console.log("The Worker Activated", event);
    event.waitUntil(self.clients.claim());
  });
  self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
  });
  addEventListener("message", (event) => {
    console.log("The Worker Received a Message", event);
    if (typeof event.data === "object" && !Array.isArray(event.data) && event.data !== null) {
      if (event.data.type === "downloadVideos") {
        downloadVideos(event.data.course);
      }
    }
  });
  async function cacheFirst(request) {
    return await fileFromCache(request) || await fetch(request);
  }
  async function fileFromCache(request) {
    const url = new URL(request.url);
    if (url && url.search.includes("forcedownload=true")) {
      url.search = "";
      const response2 = await caches.match(url);
      if (response2) {
        const fileName = url.pathname.split("/").pop();
        response2.headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
      }
      return Promise.resolve(response2);
    }
    if (request.headers.has("range")) {
      const fullResp = await caches.match(request.url);
      if (fullResp) {
        return Promise.resolve(createPartialResponse(request, fullResp));
      }
    }
    const response = await caches.match(request);
    return Promise.resolve(response);
  }
  async function downloadVideos(course) {
    const cache = await caches.open(`course-videos-${course.id}`);
    eachOfLimit$1(course.videos, 3, async (url) => {
      const response = await fetch(url);
      const videoBlob = await response.blob();
      const videoName = url.split("/").pop();
      await cache.put(`/courses/${course.id}/static_resources/${videoName}`, new Response(videoBlob, { headers: { "Content-Type": "video/mp4" } }));
      postToClients({ type: "videoDownloaded", courseId: course.id, url });
    });
  }
  async function postToClients(message) {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage(message));
  }
})();
//# sourceMappingURL=worker.js.map
