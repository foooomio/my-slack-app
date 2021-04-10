var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __objSpread = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/request-compose/request/defaults.js
var require_defaults = __commonJS((exports2, module2) => {
  var options = [
    "agent",
    "auth",
    "createConnection",
    "defaultPort",
    "family",
    "headers",
    "host",
    "hostname",
    "insecureHTTPParser",
    "localAddress",
    "lookup",
    "maxHeaderSize",
    "method",
    "path",
    "port",
    "protocol",
    "setHost",
    "socketPath",
    "timeout",
    "ca",
    "cert",
    "ciphers",
    "clientCertEngine",
    "crl",
    "dhparam",
    "ecdhCurve",
    "honorCipherOrder",
    "key",
    "passphrase",
    "pfx",
    "rejectUnauthorized",
    "secureOptions",
    "secureProtocol",
    "servername",
    "sessionIdContext",
    "highWaterMark"
  ];
  module2.exports = (_args = {}) => (args = _args) => {
    var defaults = {
      protocol: args.protocol || "http:",
      hostname: args.hostname || "localhost",
      port: args.port || 80,
      method: (args.method || "GET").toUpperCase(),
      path: args.path || "/",
      headers: args.headers ? JSON.parse(JSON.stringify(args.headers)) : {},
      timeout: args.timeout || 5e3
    };
    return {
      options: options.reduce((http, option) => (defaults[option] !== void 0 ? http[option] = defaults[option] : args[option] !== void 0 ? http[option] = args[option] : null, http), {})
    };
  };
});

// node_modules/request-compose/request/url.js
var require_url = __commonJS((exports2, module2) => {
  var url = require("url");
  module2.exports = (uri) => ({options}) => {
    uri = typeof uri === "string" ? url.parse(uri) : uri;
    options.protocol = uri.protocol;
    options.hostname = uri.hostname;
    options.port = uri.port;
    options.path = uri.path;
    return {options};
  };
});

// node_modules/request-compose/request/proxy.js
var require_proxy = __commonJS((exports2, module2) => {
  var url = require("url");
  module2.exports = (proxy) => ({options}) => {
    options.path = (() => {
      var path = `${options.protocol}//${options.hostname}`;
      if (options.port && !/^(?:80|443)$/.test(options.port)) {
        path += `:${options.port}`;
      }
      path += options.path;
      return path;
    })();
    options.headers.host = options.hostname;
    var uri = typeof proxy === "string" ? url.parse(proxy) : proxy;
    options.protocol = uri.protocol;
    options.hostname = uri.hostname;
    options.port = uri.port;
    return {options};
  };
});

// node_modules/request-compose/request/qs.js
var require_qs = __commonJS((exports2, module2) => {
  var querystring = require("querystring");
  module2.exports = (qs, redirect = {}) => ({options}) => {
    if (redirect.followed) {
      return {options};
    }
    if (typeof qs === "object") {
      qs = JSON.parse(JSON.stringify(qs));
      var [path, query] = options.path.split("?");
      query = querystring.parse(query);
      qs = rfc3986(querystring.stringify(Object.assign(query, qs)));
      options.path = path + (qs ? `?${qs}` : "");
    } else if (typeof qs === "string") {
      var [path, query] = options.path.split("?");
      options.path = path + (query ? `?${query}&${qs}` : `?${qs}`);
    }
    return {options};
  };
  var rfc3986 = (str) => str.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
});

// node_modules/request-compose/request/form.js
var require_form = __commonJS((exports2, module2) => {
  var querystring = require("querystring");
  module2.exports = (form) => ({options, options: {headers}}) => {
    var header = Object.keys(headers).find((name) => name.toLowerCase() === "content-type");
    if (!header) {
      headers["content-type"] = "application/x-www-form-urlencoded";
    }
    var body = typeof form === "string" ? form : typeof form === "object" ? rfc3986(querystring.stringify(JSON.parse(JSON.stringify(form)))) : "";
    return {options, body};
  };
  var rfc3986 = (str) => str.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
});

// node_modules/request-compose/request/json.js
var require_json = __commonJS((exports2, module2) => {
  module2.exports = (json) => ({options, options: {headers}}) => {
    json = typeof json === "object" ? JSON.stringify(json) : json || "";
    var header = Object.keys(headers).find((name) => name.toLowerCase() === "content-type");
    if (!header) {
      headers["content-type"] = "application/json";
    }
    return {options, body: json};
  };
});

// node_modules/request-compose/request/body.js
var require_body = __commonJS((exports2, module2) => {
  module2.exports = (body) => ({options}) => {
    return {options, body};
  };
});

// node_modules/request-compose/request/auth.js
var require_auth = __commonJS((exports2, module2) => {
  module2.exports = ({user, pass}) => ({options, options: {headers}, body}) => {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass || ""}`, "utf8").toString("base64")}`;
    return {options, body};
  };
});

// node_modules/request-compose/request/length.js
var require_length = __commonJS((exports2, module2) => {
  var fs = require("fs");
  var stream = require("stream");
  module2.exports = () => ({options, options: {headers}, body}) => new Promise((resolve) => {
    var length = Object.keys(headers).find((name) => name.toLowerCase() === "content-length");
    var encoding = Object.keys(headers).find((name) => name.toLowerCase() === "transfer-encoding");
    if (headers[length] || headers[encoding] === "chunked") {
      resolve({options, body});
      return;
    }
    var getLength = (body2, length2, done) => {
      if (typeof body2 === "string") {
        done(null, Buffer.byteLength(body2));
      } else if (body2 instanceof Buffer) {
        done(null, body2.length);
      } else if (body2 && body2.constructor && body2.constructor.name === "BufferListStream") {
        done(null, body2.length);
      } else if (body2 instanceof stream.Stream) {
        if (body2.hasOwnProperty("fd")) {
          fs.stat(body2.path, (err, stats) => done(err, stats && stats.size));
        } else if (body2.hasOwnProperty("httpVersion")) {
          done(!body2.headers["content-length"], parseInt(body2.headers["content-length"]));
        } else if (body2._items) {
          ;
          (function loop(index) {
            if (index === body2._items.length) {
              done(null, length2);
              return;
            }
            var item = body2._items[index];
            if (item._knownLength) {
              length2 += parseInt(item._knownLength);
              loop(++index);
            } else {
              getLength(item, length2, (err, len) => {
                if (err) {
                  done(err);
                  return;
                }
                length2 += len;
                loop(++index);
              });
            }
          })(0);
        } else {
          done(true);
        }
      } else {
        done(true);
      }
    };
    getLength(body, 0, (err, length2) => {
      err ? headers["transfer-encoding"] = "chunked" : headers["content-length"] = length2;
      resolve({options, body});
    });
  });
});

// node_modules/request-compose/utils/log.js
var require_log = __commonJS((exports2, module2) => {
  module2.exports = (data) => {
    if (process.env.DEBUG) {
      try {
        require("request-logs")(data);
      } catch (err) {
      }
    }
  };
});

// node_modules/request-compose/request/send.js
var require_send = __commonJS((exports2, module2) => {
  var http = require("http");
  var https = require("https");
  var stream = require("stream");
  var crypto = require("crypto");
  var log = require_log();
  module2.exports = () => ({options, body}) => new Promise((resolve, reject) => {
    var id = crypto.randomBytes(20).toString("hex");
    var req = (/https/.test(options.protocol) ? https : http).request(options).on("response", (res) => {
      res.id = id;
      log({send: {res}});
      resolve({options, res});
    }).on("error", reject).on("timeout", () => {
      var err = new Error("request-compose: timeout");
      err.code = "ETIMEDOUT";
      req.emit("error", err);
      req.abort();
    }).setTimeout(options.timeout);
    body instanceof stream.Stream ? body.pipe(req) : req.end(body);
    req.id = id;
    log({send: {req, body, options}});
  });
});

// node_modules/request-compose/response/buffer.js
var require_buffer = __commonJS((exports2, module2) => {
  module2.exports = () => ({options, res}) => new Promise((resolve, reject) => {
    var body = [];
    res.on("data", (chunk) => body.push(chunk)).on("end", () => {
      body = Buffer.concat(body);
      resolve({options, res, body});
    }).on("error", reject);
  });
});

// node_modules/request-compose/response/gzip.js
var require_gzip = __commonJS((exports2, module2) => {
  var zlib = require("zlib");
  module2.exports = () => ({options, res, body, raw}) => new Promise((resolve, reject) => {
    var header = Object.keys(res.headers).find((name) => name.toLowerCase() === "content-encoding");
    var decode = /gzip/i.test(res.headers[header]) ? "gunzip" : /deflate/i.test(res.headers[header]) ? "inflate" : false;
    if (decode) {
      raw = body;
      var opts = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      zlib[decode](body, opts, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({options, res, body: decoded, raw});
      });
    } else {
      resolve({options, res, body, raw});
    }
  });
});

// node_modules/request-compose/response/string.js
var require_string = __commonJS((exports2, module2) => {
  var log = require_log();
  module2.exports = (encoding) => ({options, res, body, raw}) => {
    raw = body;
    body = Buffer.from(body).toString(encoding);
    log({string: {res, body}});
    return {options, res, body, raw};
  };
});

// node_modules/request-compose/response/parse.js
var require_parse = __commonJS((exports2, module2) => {
  var querystring = require("querystring");
  var log = require_log();
  module2.exports = () => ({options, res, res: {headers}, body, raw}) => {
    raw = body;
    var header = Object.keys(headers).find((name) => name.toLowerCase() === "content-type");
    if (/json|javascript/.test(headers[header])) {
      try {
        body = JSON.parse(body);
      } catch (err) {
      }
    } else if (/application\/x-www-form-urlencoded/.test(headers[header])) {
      try {
        body = querystring.parse(body);
      } catch (err) {
      }
    }
    log({parse: {res, body}});
    return {options, res, body, raw};
  };
});

// node_modules/request-compose/utils/error.js
var require_error = __commonJS((exports2, module2) => {
  module2.exports = ({res, body, raw = body}) => {
    var error = new Error();
    error.message = `${res.statusCode} ${res.statusMessage}`;
    error.res = res;
    error.body = body;
    error.raw = raw;
    return error;
  };
});

// node_modules/request-compose/response/status.js
var require_status = __commonJS((exports2, module2) => {
  var error = require_error();
  var log = require_log();
  module2.exports = () => ({options, res, body, raw}) => {
    log({status: {res, body, raw}});
    if (/^(2|3)/.test(res.statusCode)) {
      return {options, res, body, raw};
    } else if (/^(4|5)/.test(res.statusCode)) {
      throw error({options, res, body, raw});
    }
  };
});

// node_modules/request-compose/response/redirect.js
var require_redirect = __commonJS((exports2, module2) => {
  var url = require("url");
  var error = require_error();
  module2.exports = (args, client) => ({options, res, body, raw}) => {
    if (!/^3/.test(res.statusCode)) {
      return {options, res, body, raw};
    }
    var defaults = {
      max: 3,
      all: false,
      method: true,
      referer: false,
      auth: true,
      followed: 0,
      hostname: options.hostname
    };
    var redirect = Object.assign(defaults, args.redirect);
    var header = Object.keys(res.headers).find((name) => name.toLowerCase() === "location");
    var location = res.headers[header];
    if (!location || !redirect.all && /patch|put|post|delete/i.test(options.method)) {
      return {options, res, body, raw};
    }
    if (!/^https?:/.test(location)) {
      location = url.resolve(options.protocol + "//" + options.hostname + (options.port && options.port !== 80 ? `:${options.port}` : ""), location.startsWith("/") ? location : (options.path + `/${location}`).replace(/\/{2,}/g, "/"));
    }
    var copy = Object.assign({}, args, {url: location, redirect});
    copy.headers = JSON.parse(JSON.stringify(copy.headers || {}));
    if (!redirect.auth && redirect.hostname !== url.parse(location).hostname) {
      var header = Object.keys(copy.headers).find((name) => name.toLowerCase() === "authorization");
      if (header) {
        delete copy.headers[header];
      }
      delete copy.auth;
      delete copy.oauth;
    }
    if (!redirect.method && /patch|put|post|delete/i.test(options.method)) {
      copy.method = "GET";
    }
    if (redirect.referer) {
      copy.headers.referer = url.resolve(options.protocol + "//" + options.hostname + (options.port && options.port !== 80 ? `:${options.port}` : ""), options.path);
    }
    if (redirect.followed < redirect.max) {
      redirect.followed++;
      return client(copy);
    } else {
      var err = error({res, body, raw});
      err.message = "request-compose: exceeded maximum redirects";
      throw err;
    }
  };
});

// node_modules/request-compose/compose.js
var require_compose = __commonJS((exports2, module2) => {
  var ctor = () => (...fns) => (args) => fns.reduce((p, f) => p.then(f), Promise.resolve(args));
  var compose = ctor();
  var Request = {
    defaults: require_defaults(),
    url: require_url(),
    proxy: require_proxy(),
    qs: require_qs(),
    form: require_form(),
    json: require_json(),
    body: require_body(),
    auth: require_auth(),
    length: require_length(),
    send: require_send()
  };
  var Response = {
    buffer: require_buffer(),
    gzip: require_gzip(),
    string: require_string(),
    parse: require_parse(),
    status: require_status(),
    redirect: require_redirect()
  };
  var request = (Request2) => (args) => compose(Request2.defaults(args), (() => args.url ? Request2.url(args.url) : ({options}) => ({options}))(), (() => args.proxy ? Request2.proxy(args.proxy) : ({options}) => ({options}))(), (() => args.qs ? Request2.qs(args.qs, args.redirect) : ({options}) => ({options}))(), (() => args.cookie ? Request2.cookie(args.cookie) : ({options}) => ({options}))(), (() => args.form ? Request2.form(args.form) : args.json ? Request2.json(args.json) : args.multipart ? Request2.multipart(args.multipart) : args.body ? Request2.body(args.body) : ({options}) => ({options}))(), (() => args.auth ? Request2.auth(args.auth) : args.oauth ? Request2.oauth(args.oauth) : ({options, body}) => ({options, body}))(), (() => ({options, body}) => body ? Request2.length()({options, body}) : {options})(), Request2.send())();
  var client = (Request2, Response2) => (args) => compose((_) => request(Request2)(args), (() => args.cookie ? Response2.cookie(args.cookie) : ({options, res}) => ({options, res}))(), Response2.buffer(), Response2.gzip(), Response2.string(args.encoding), Response2.parse(), Response2.status(), Response2.redirect(args, client(Request2, Response2)))();
  var buffer = (Request2, Response2) => (args) => compose((_) => request(Request2)(args), (() => args.cookie ? Response2.cookie(args.cookie) : ({options, res}) => ({options, res}))(), Response2.buffer(), Response2.gzip(), Response2.status(), Response2.redirect(args, buffer(Request2, Response2)))();
  var stream = (Request2, Response2) => (args) => compose((_) => request(Request2)(args), (() => args.cookie ? Response2.cookie(args.cookie) : ({options, res}) => ({options, res}))(), Response2.status())();
  var extend = (mw) => ((req = Object.assign({}, Request, mw.Request), res = Object.assign({}, Response, mw.Response)) => Object.assign(ctor(), {
    Request: req,
    Response: res,
    client: client(req, res),
    buffer: buffer(req, res),
    stream: stream(req, res),
    extend
  }))();
  module2.exports = extend({Request, Response});
});

// node_modules/chrome-webstore/map/detail.js
var require_detail = __commonJS((exports2, module2) => {
  module2.exports = (detail) => ({
    id: detail[0][0],
    name: detail[0][1],
    title: detail[0][6],
    slug: detail[0][61],
    url: detail[0][37],
    author: {
      name: detail[0][2],
      domain: detail[0][35],
      url: detail[0][81]
    },
    description: detail[1],
    website: detail[3],
    support: detail[5],
    version: detail[6],
    size: detail[25],
    published: detail[7],
    users: detail[0][23],
    rating: {
      average: detail[0][12],
      count: detail[0][22]
    },
    price: detail[0][30],
    purchases: detail[36],
    category: {
      name: detail[0][10],
      slug: detail[0][9]
    },
    images: {
      "26x26": detail[0][3],
      "128x128": detail[0][25],
      "141x90": detail[0][65],
      "220x140": detail[0][4],
      "440x280": detail[0][76],
      "460x340": detail[0][5]
    },
    languages: detail[8],
    developer: {
      email: detail[35][0] || null,
      address: detail[35][1] || null,
      policy: detail[35][2] || null
    },
    type: detail[10],
    status: detail[0][84],
    manifest: detail[9][0]
  });
});

// node_modules/chrome-webstore/map/item.js
var require_item = __commonJS((exports2, module2) => {
  module2.exports = (item) => ({
    id: item[0],
    name: item[1],
    title: item[6],
    slug: item[61],
    url: item[37],
    author: {
      name: item[2],
      domain: item[35],
      url: item[81]
    },
    users: item[23],
    rating: {
      average: item[12],
      count: item[22]
    },
    price: item[30],
    category: {
      name: item[10],
      slug: item[9]
    },
    images: {
      "26x26": item[3],
      "128x128": item[25],
      "141x90": item[65],
      "220x140": item[4],
      "440x280": item[76],
      "460x340": item[5]
    },
    status: item[84]
  });
});

// node_modules/chrome-webstore/map/review.js
var require_review = __commonJS((exports2, module2) => {
  module2.exports = (review) => ({
    rating: review[3],
    message: review[4],
    created: review[6],
    updated: review[7],
    author: {
      id: review[2][0],
      name: review[2][1],
      avatar: review[2][2] ? `https:${review[2][2]}` : null
    }
  });
});

// node_modules/chrome-webstore/map/issue.js
var require_issue = __commonJS((exports2, module2) => {
  module2.exports = (issue) => ({
    type: issue[2] === 0 ? "problem" : issue[2] === 1 ? "question" : issue[2] === 2 ? "suggestion" : "",
    status: issue[3] === 0 ? "open" : issue[3] === 1 ? "in progress" : issue[3] === 2 ? "closed" : "",
    title: issue[5],
    description: issue[6],
    browser: issue[9],
    version: issue[10],
    date: issue[12],
    author: {
      id: issue[16][0],
      name: issue[16][1],
      avatar: issue[16][2] ? `https:${issue[16][2]}` : null
    }
  });
});

// node_modules/chrome-webstore/client.js
var require_client = __commonJS((exports2, module2) => {
  var compose = require_compose();
  var detail = require_detail();
  var item = require_item();
  var review = require_review();
  var issue = require_issue();
  var VERSION = "20201016";
  module2.exports = {
    items: (_a) => {
      var _b = _a, {search, category, rating, features, count, offset, locale, version} = _b, options = __objRest(_b, ["search", "category", "rating", "features", "count", "offset", "locale", "version"]);
      return compose((_) => compose.client(__objSpread(__objSpread({}, options), {
        method: "POST",
        url: "https://chrome.google.com/webstore/ajax/item",
        qs: {
          searchTerm: search,
          category,
          features: (features || []).map((i) => ({offline: 4, google: 1, free: 5, android: 0, gdrive: 12})[i]).concat({5: 9, 4: 8, 3: 7, 2: 6}[rating]).filter((i) => typeof i === "number"),
          count: count || 5,
          token: offset ? `${offset}@${offset}` : void 0,
          hl: locale || "en",
          pv: version || VERSION
        }
      })), ({body}) => JSON.parse(body.slice(5))[1][1].map(item))();
    },
    detail: (_c) => {
      var _d = _c, {id, related, more, locale, version} = _d, options = __objRest(_d, ["id", "related", "more", "locale", "version"]);
      return compose((_) => compose.client(__objSpread(__objSpread({}, options), {
        method: "POST",
        url: "https://chrome.google.com/webstore/ajax/detail",
        qs: {
          id,
          hl: locale || "en",
          pv: version || VERSION
        }
      })), ({body}) => ((json = JSON.parse(body.slice(5))) => Object.assign(detail(json[1][1]), related && {related: json[1][2].map(item)}, more && {more: json[1][3].map(item)}))())();
    },
    reviews: (_e) => {
      var _f = _e, {id, count, offset, locale, sort, version} = _f, options = __objRest(_f, ["id", "count", "offset", "locale", "sort", "version"]);
      return compose((_) => compose.client(__objSpread(__objSpread({}, options), {
        method: "POST",
        url: "https://chrome.google.com/webstore/reviews/get",
        qs: {
          pv: version || VERSION
        },
        form: {
          "f.req": JSON.stringify([
            `http://chrome.google.com/extensions/permalink?id=${id}`,
            locale || "",
            [count || 5, offset || 0],
            {helpful: 1, recent: 2}[sort] || 1,
            []
          ])
        }
      })), ({body}) => JSON.parse(body.slice(5))[1][4].map(review))();
    },
    issues: (_g) => {
      var _h = _g, {id, type, count, page, version} = _h, options = __objRest(_h, ["id", "type", "count", "page", "version"]);
      return compose((_) => compose.client(__objSpread(__objSpread({}, options), {
        method: "POST",
        url: "https://chrome.google.com/webstore/issues/get",
        qs: {
          pv: version || VERSION
        },
        form: {
          "f.req": JSON.stringify([
            `http://chrome.google.com/extensions/permalink?id=${id}`,
            null,
            type === "problem" ? 0 : type === "question" ? 1 : type === "suggestion" ? 2 : null,
            null,
            null,
            null,
            null,
            page || 1,
            count || 5
          ])
        }
      })), ({body}) => JSON.parse(body.slice(5))[1][1].map(issue))();
    },
    version: (options) => compose((_) => compose.client(__objSpread(__objSpread({}, options), {
      method: "GET",
      url: "https://chrome.google.com/webstore/category/extensions"
    })), ({body}) => JSON.parse(/<script type="application\/json" id="cws-session-data"[^>]*>([\s\S]+?)<\/script>/.exec(body)[1])[20])()
  };
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS((exports2, module2) => {
  "use strict";
  var bind = require_bind();
  var toString = Object.prototype.toString;
  function isArray(val) {
    return toString.call(val) === "[object Array]";
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  function isArrayBuffer(val) {
    return toString.call(val) === "[object ArrayBuffer]";
  }
  function isFormData(val) {
    return typeof FormData !== "undefined" && val instanceof FormData;
  }
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && val.buffer instanceof ArrayBuffer;
    }
    return result;
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isNumber(val) {
    return typeof val === "number";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(val) {
    if (toString.call(val) !== "[object Object]") {
      return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }
  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }
  function isFile(val) {
    return toString.call(val) === "[object File]";
  }
  function isBlob(val) {
    return toString.call(val) === "[object Blob]";
  }
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
  }
  function trim(str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
  }
  function isStandardBrowserEnv() {
    if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
      return false;
    }
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function merge() {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  module2.exports = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    extend,
    trim,
    stripBOM
  };
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  module2.exports = function buildURL(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  };
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  function InterceptorManager() {
    this.handlers = [];
  }
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  };
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };
  module2.exports = InterceptorManager;
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  module2.exports = function transformData(data, headers, fns) {
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });
    return data;
  };
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  module2.exports = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };
});

// node_modules/axios/lib/core/enhanceError.js
var require_enhanceError = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: this.config,
        code: this.code
      };
    };
    return error;
  };
});

// node_modules/axios/lib/core/createError.js
var require_createError = __commonJS((exports2, module2) => {
  "use strict";
  var enhanceError = require_enhanceError();
  module2.exports = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS((exports2, module2) => {
  "use strict";
  var createError = require_createError();
  module2.exports = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
    }
  };
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }() : function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove() {
      }
    };
  }();
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS((exports2, module2) => {
  "use strict";
  var isAbsoluteURL = require_isAbsoluteURL();
  var combineURLs = require_combineURLs();
  module2.exports = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  module2.exports = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers) {
      return parsed;
    }
    utils.forEach(headers.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement("a");
    var originURL;
    function resolveURL(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin(requestURL) {
      var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }() : function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  }();
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var settle = require_settle();
  var cookies = require_cookies();
  var buildURL = require_buildURL();
  var buildFullPath = require_buildFullPath();
  var parseHeaders = require_parseHeaders();
  var isURLSameOrigin = require_isURLSameOrigin();
  var createError = require_createError();
  module2.exports = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      if (utils.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      var request = new XMLHttpRequest();
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
      request.timeout = config.timeout;
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === "text" ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(resolve, reject, response);
        request = null;
      };
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(createError("Request aborted", config, "ECONNABORTED", request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(createError("Network Error", config, null, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = "timeout of " + config.timeout + "ms exceeded";
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, "ECONNABORTED", request));
        request = null;
      };
      if (utils.isStandardBrowserEnv()) {
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }
      if ("setRequestHeader" in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
            delete requestHeaders[key];
          } else {
            request.setRequestHeader(key, val);
          }
        });
      }
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          if (config.responseType !== "json") {
            throw e;
          }
        }
      }
      if (typeof config.onDownloadProgress === "function") {
        request.addEventListener("progress", config.onDownloadProgress);
      }
      if (typeof config.onUploadProgress === "function" && request.upload) {
        request.upload.addEventListener("progress", config.onUploadProgress);
      }
      if (config.cancelToken) {
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }
          request.abort();
          reject(cancel);
          request = null;
        });
      }
      if (!requestData) {
        requestData = null;
      }
      request.send(requestData);
    });
  };
});

// node_modules/ms/index.js
var require_ms = __commonJS((exports2, module2) => {
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  module2.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + "s";
    }
    return ms + "ms";
  }
  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
  }
  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS((exports2, module2) => {
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = require_ms();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self = debug;
        const curr = Number(new Date());
        const ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend;
      debug.destroy = createDebug.destroy;
      Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      return debug;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      let i;
      const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      const len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      const namespaces = [
        ...createDebug.names.map(toNamespace),
        ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      let i;
      let len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function toNamespace(regexp) {
      return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  module2.exports = setup;
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS((exports2, module2) => {
  exports2.formatArgs = formatArgs;
  exports2.save = save;
  exports2.load = load;
  exports2.useColors = useColors;
  exports2.storage = localstorage();
  exports2.destroy = (() => {
    let warned = false;
    return () => {
      if (!warned) {
        warned = true;
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
    };
  })();
  exports2.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === "%%") {
        return;
      }
      index++;
      if (match === "%c") {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  exports2.log = console.debug || console.log || (() => {
  });
  function save(namespaces) {
    try {
      if (namespaces) {
        exports2.storage.setItem("debug", namespaces);
      } else {
        exports2.storage.removeItem("debug");
      }
    } catch (error) {
    }
  }
  function load() {
    let r;
    try {
      r = exports2.storage.getItem("debug");
    } catch (error) {
    }
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {
    }
  }
  module2.exports = require_common()(exports2);
  var {formatters} = module2.exports;
  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
});

// node_modules/debug/src/node.js
var require_node = __commonJS((exports2, module2) => {
  var tty = require("tty");
  var util = require("util");
  exports2.init = init;
  exports2.log = log;
  exports2.formatArgs = formatArgs;
  exports2.save = save;
  exports2.load = load;
  exports2.useColors = useColors;
  exports2.destroy = util.deprecate(() => {
  }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  exports2.colors = [6, 2, 3, 4, 5, 1];
  try {
    const supportsColor = require("supports-color");
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
      exports2.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ];
    }
  } catch (error) {
  }
  exports2.inspectOpts = Object.keys(process.env).filter((key) => {
    return /^debug_/i.test(key);
  }).reduce((obj, key) => {
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
      return k.toUpperCase();
    });
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
      val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
      val = false;
    } else if (val === "null") {
      val = null;
    } else {
      val = Number(val);
    }
    obj[prop] = val;
    return obj;
  }, {});
  function useColors() {
    return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
  }
  function formatArgs(args) {
    const {namespace: name, useColors: useColors2} = this;
    if (useColors2) {
      const c = this.color;
      const colorCode = "[3" + (c < 8 ? c : "8;5;" + c);
      const prefix = `  ${colorCode};1m${name} [0m`;
      args[0] = prefix + args[0].split("\n").join("\n" + prefix);
      args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "[0m");
    } else {
      args[0] = getDate() + name + " " + args[0];
    }
  }
  function getDate() {
    if (exports2.inspectOpts.hideDate) {
      return "";
    }
    return new Date().toISOString() + " ";
  }
  function log(...args) {
    return process.stderr.write(util.format(...args) + "\n");
  }
  function save(namespaces) {
    if (namespaces) {
      process.env.DEBUG = namespaces;
    } else {
      delete process.env.DEBUG;
    }
  }
  function load() {
    return process.env.DEBUG;
  }
  function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports2.inspectOpts);
    for (let i = 0; i < keys.length; i++) {
      debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
    }
  }
  module2.exports = require_common()(exports2);
  var {formatters} = module2.exports;
  formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
  };
  formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
});

// node_modules/debug/src/index.js
var require_src = __commonJS((exports2, module2) => {
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    module2.exports = require_browser();
  } else {
    module2.exports = require_node();
  }
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS((exports2, module2) => {
  var debug;
  module2.exports = function() {
    if (!debug) {
      try {
        debug = require_src()("follow-redirects");
      } catch (error) {
        debug = function() {
        };
      }
    }
    debug.apply(null, arguments);
  };
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS((exports2, module2) => {
  var url = require("url");
  var URL = url.URL;
  var http = require("http");
  var https = require("https");
  var Writable = require("stream").Writable;
  var assert = require("assert");
  var debug = require_debug();
  var eventHandlers = Object.create(null);
  ["abort", "aborted", "connect", "error", "socket", "timeout"].forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });
  var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "");
  var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
  var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
  var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
  function RedirectableRequest(options, responseCallback) {
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    if (responseCallback) {
      this.on("response", responseCallback);
    }
    var self = this;
    this._onNativeResponse = function(response) {
      self._processResponse(response);
    };
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);
  RedirectableRequest.prototype.abort = function() {
    this._currentRequest.removeAllListeners();
    this._currentRequest.on("error", noop);
    this._currentRequest.abort();
    this.emit("abort");
    this.removeAllListeners();
  };
  RedirectableRequest.prototype.write = function(data, encoding, callback) {
    if (this._ending) {
      throw new WriteAfterEndError();
    }
    if (!(typeof data === "string" || typeof data === "object" && "length" in data)) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({data, encoding});
      this._currentRequest.write(data, encoding, callback);
    } else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };
  RedirectableRequest.prototype.end = function(data, encoding, callback) {
    if (typeof data === "function") {
      callback = data;
      data = encoding = null;
    } else if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }
    if (!data) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    } else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data, encoding, function() {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };
  RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };
  RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };
  RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self = this;
    if (callback) {
      this.on("timeout", callback);
    }
    function startTimer() {
      if (self._timeout) {
        clearTimeout(self._timeout);
      }
      self._timeout = setTimeout(function() {
        self.emit("timeout");
        clearTimer();
      }, msecs);
    }
    function clearTimer() {
      clearTimeout(this._timeout);
      if (callback) {
        self.removeListener("timeout", callback);
      }
      if (!this.socket) {
        self._currentRequest.removeListener("socket", startTimer);
      }
    }
    if (this.socket) {
      startTimer();
    } else {
      this._currentRequest.once("socket", startTimer);
    }
    this.once("response", clearTimer);
    this.once("error", clearTimer);
    return this;
  };
  [
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
  ].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
      return this._currentRequest[method](a, b);
    };
  });
  ["aborted", "connection", "socket"].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function() {
        return this._currentRequest[property];
      }
    });
  });
  RedirectableRequest.prototype._sanitizeOptions = function(options) {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.host) {
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      } else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };
  RedirectableRequest.prototype._performRequest = function() {
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      this.emit("error", new TypeError("Unsupported protocol " + protocol));
      return;
    }
    if (this._options.agents) {
      var scheme = protocol.substr(0, protocol.length - 1);
      this._options.agent = this._options.agents[scheme];
    }
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    this._currentUrl = url.format(this._options);
    request._redirectable = this;
    for (var event in eventHandlers) {
      if (event) {
        request.on(event, eventHandlers[event]);
      }
    }
    if (this._isRedirect) {
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        if (request === self._currentRequest) {
          if (error) {
            self.emit("error", error);
          } else if (i < buffers.length) {
            var buffer = buffers[i++];
            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          } else if (self._ended) {
            request.end();
          }
        }
      })();
    }
  };
  RedirectableRequest.prototype._processResponse = function(response) {
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode
      });
    }
    var location = response.headers.location;
    if (location && this._options.followRedirects !== false && statusCode >= 300 && statusCode < 400) {
      this._currentRequest.removeAllListeners();
      this._currentRequest.on("error", noop);
      this._currentRequest.abort();
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
      }
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) || url.parse(this._currentUrl).hostname;
      var redirectUrl = url.resolve(this._currentUrl, location);
      debug("redirecting to", redirectUrl);
      this._isRedirect = true;
      var redirectUrlParts = url.parse(redirectUrl);
      Object.assign(this._options, redirectUrlParts);
      if (redirectUrlParts.hostname !== previousHostName) {
        removeMatchingHeaders(/^authorization$/i, this._options.headers);
      }
      if (typeof this._options.beforeRedirect === "function") {
        var responseDetails = {headers: response.headers};
        try {
          this._options.beforeRedirect.call(null, this._options, responseDetails);
        } catch (err) {
          this.emit("error", err);
          return;
        }
        this._sanitizeOptions(this._options);
      }
      try {
        this._performRequest();
      } catch (cause) {
        var error = new RedirectionError("Redirected request failed: " + cause.message);
        error.cause = cause;
        this.emit("error", error);
      }
    } else {
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);
      this._requestBodyBuffers = [];
    }
  };
  function wrap(protocols) {
    var exports3 = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024
    };
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports3[scheme] = Object.create(nativeProtocol);
      function request(input, options, callback) {
        if (typeof input === "string") {
          var urlStr = input;
          try {
            input = urlToOptions(new URL(urlStr));
          } catch (err) {
            input = url.parse(urlStr);
          }
        } else if (URL && input instanceof URL) {
          input = urlToOptions(input);
        } else {
          callback = options;
          options = input;
          input = {protocol};
        }
        if (typeof options === "function") {
          callback = options;
          options = null;
        }
        options = Object.assign({
          maxRedirects: exports3.maxRedirects,
          maxBodyLength: exports3.maxBodyLength
        }, input, options);
        options.nativeProtocols = nativeProtocols;
        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug("options", options);
        return new RedirectableRequest(options, callback);
      }
      function get(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        wrappedRequest.end();
        return wrappedRequest;
      }
      Object.defineProperties(wrappedProtocol, {
        request: {value: request, configurable: true, enumerable: true, writable: true},
        get: {value: get, configurable: true, enumerable: true, writable: true}
      });
    });
    return exports3;
  }
  function noop() {
  }
  function urlToOptions(urlObject) {
    var options = {
      protocol: urlObject.protocol,
      hostname: urlObject.hostname.startsWith("[") ? urlObject.hostname.slice(1, -1) : urlObject.hostname,
      hash: urlObject.hash,
      search: urlObject.search,
      pathname: urlObject.pathname,
      path: urlObject.pathname + urlObject.search,
      href: urlObject.href
    };
    if (urlObject.port !== "") {
      options.port = Number(urlObject.port);
    }
    return options;
  }
  function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for (var header in headers) {
      if (regex.test(header)) {
        lastValue = headers[header];
        delete headers[header];
      }
    }
    return lastValue;
  }
  function createErrorType(code, defaultMessage) {
    function CustomError(message) {
      Error.captureStackTrace(this, this.constructor);
      this.message = message || defaultMessage;
    }
    CustomError.prototype = new Error();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    CustomError.prototype.code = code;
    return CustomError;
  }
  module2.exports = wrap({http, https});
  module2.exports.wrap = wrap;
});

// node_modules/axios/package.json
var require_package = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "axios",
    version: "0.21.1",
    description: "Promise based HTTP client for the browser and node.js",
    main: "index.js",
    scripts: {
      test: "grunt test && bundlesize",
      start: "node ./sandbox/server.js",
      build: "NODE_ENV=production grunt build",
      preversion: "npm test",
      version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
      postversion: "git push && git push --tags",
      examples: "node ./examples/server.js",
      coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
      fix: "eslint --fix lib/**/*.js"
    },
    repository: {
      type: "git",
      url: "https://github.com/axios/axios.git"
    },
    keywords: [
      "xhr",
      "http",
      "ajax",
      "promise",
      "node"
    ],
    author: "Matt Zabriskie",
    license: "MIT",
    bugs: {
      url: "https://github.com/axios/axios/issues"
    },
    homepage: "https://github.com/axios/axios",
    devDependencies: {
      bundlesize: "^0.17.0",
      coveralls: "^3.0.0",
      "es6-promise": "^4.2.4",
      grunt: "^1.0.2",
      "grunt-banner": "^0.6.0",
      "grunt-cli": "^1.2.0",
      "grunt-contrib-clean": "^1.1.0",
      "grunt-contrib-watch": "^1.0.0",
      "grunt-eslint": "^20.1.0",
      "grunt-karma": "^2.0.0",
      "grunt-mocha-test": "^0.13.3",
      "grunt-ts": "^6.0.0-beta.19",
      "grunt-webpack": "^1.0.18",
      "istanbul-instrumenter-loader": "^1.0.0",
      "jasmine-core": "^2.4.1",
      karma: "^1.3.0",
      "karma-chrome-launcher": "^2.2.0",
      "karma-coverage": "^1.1.1",
      "karma-firefox-launcher": "^1.1.0",
      "karma-jasmine": "^1.1.1",
      "karma-jasmine-ajax": "^0.1.13",
      "karma-opera-launcher": "^1.0.0",
      "karma-safari-launcher": "^1.0.0",
      "karma-sauce-launcher": "^1.2.0",
      "karma-sinon": "^1.0.5",
      "karma-sourcemap-loader": "^0.3.7",
      "karma-webpack": "^1.7.0",
      "load-grunt-tasks": "^3.5.2",
      minimist: "^1.2.0",
      mocha: "^5.2.0",
      sinon: "^4.5.0",
      typescript: "^2.8.1",
      "url-search-params": "^0.10.0",
      webpack: "^1.13.1",
      "webpack-dev-server": "^1.14.1"
    },
    browser: {
      "./lib/adapters/http.js": "./lib/adapters/xhr.js"
    },
    jsdelivr: "dist/axios.min.js",
    unpkg: "dist/axios.min.js",
    typings: "./index.d.ts",
    dependencies: {
      "follow-redirects": "^1.10.0"
    },
    bundlesize: [
      {
        path: "./dist/axios.min.js",
        threshold: "5kB"
      }
    ]
  };
});

// node_modules/axios/lib/adapters/http.js
var require_http = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var settle = require_settle();
  var buildFullPath = require_buildFullPath();
  var buildURL = require_buildURL();
  var http = require("http");
  var https = require("https");
  var httpFollow = require_follow_redirects().http;
  var httpsFollow = require_follow_redirects().https;
  var url = require("url");
  var zlib = require("zlib");
  var pkg = require_package();
  var createError = require_createError();
  var enhanceError = require_enhanceError();
  var isHttps = /https:?/;
  function setProxy(options, proxy, location) {
    options.hostname = proxy.host;
    options.host = proxy.host;
    options.port = proxy.port;
    options.path = location;
    if (proxy.auth) {
      var base64 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    options.beforeRedirect = function beforeRedirect(redirection) {
      redirection.headers.host = redirection.host;
      setProxy(redirection, proxy, redirection.href);
    };
  }
  module2.exports = function httpAdapter(config) {
    return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
      var resolve = function resolve2(value) {
        resolvePromise(value);
      };
      var reject = function reject2(value) {
        rejectPromise(value);
      };
      var data = config.data;
      var headers = config.headers;
      if (!headers["User-Agent"] && !headers["user-agent"]) {
        headers["User-Agent"] = "axios/" + pkg.version;
      }
      if (data && !utils.isStream(data)) {
        if (Buffer.isBuffer(data)) {
        } else if (utils.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils.isString(data)) {
          data = Buffer.from(data, "utf-8");
        } else {
          return reject(createError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", config));
        }
        headers["Content-Length"] = data.length;
      }
      var auth = void 0;
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password || "";
        auth = username + ":" + password;
      }
      var fullPath = buildFullPath(config.baseURL, config.url);
      var parsed = url.parse(fullPath);
      var protocol = parsed.protocol || "http:";
      if (!auth && parsed.auth) {
        var urlAuth = parsed.auth.split(":");
        var urlUsername = urlAuth[0] || "";
        var urlPassword = urlAuth[1] || "";
        auth = urlUsername + ":" + urlPassword;
      }
      if (auth) {
        delete headers.Authorization;
      }
      var isHttpsRequest = isHttps.test(protocol);
      var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
      var options = {
        path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ""),
        method: config.method.toUpperCase(),
        headers,
        agent,
        agents: {http: config.httpAgent, https: config.httpsAgent},
        auth
      };
      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
      }
      var proxy = config.proxy;
      if (!proxy && proxy !== false) {
        var proxyEnv = protocol.slice(0, -1) + "_proxy";
        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (proxyUrl) {
          var parsedProxyUrl = url.parse(proxyUrl);
          var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
          var shouldProxy = true;
          if (noProxyEnv) {
            var noProxy = noProxyEnv.split(",").map(function trim(s) {
              return s.trim();
            });
            shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
              if (!proxyElement) {
                return false;
              }
              if (proxyElement === "*") {
                return true;
              }
              if (proxyElement[0] === "." && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                return true;
              }
              return parsed.hostname === proxyElement;
            });
          }
          if (shouldProxy) {
            proxy = {
              host: parsedProxyUrl.hostname,
              port: parsedProxyUrl.port,
              protocol: parsedProxyUrl.protocol
            };
            if (parsedProxyUrl.auth) {
              var proxyUrlAuth = parsedProxyUrl.auth.split(":");
              proxy.auth = {
                username: proxyUrlAuth[0],
                password: proxyUrlAuth[1]
              };
            }
          }
        }
      }
      if (proxy) {
        options.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
        setProxy(options, proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
      }
      var transport;
      var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsProxy ? https : http;
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        transport = isHttpsProxy ? httpsFollow : httpFollow;
      }
      if (config.maxBodyLength > -1) {
        options.maxBodyLength = config.maxBodyLength;
      }
      var req = transport.request(options, function handleResponse(res) {
        if (req.aborted)
          return;
        var stream = res;
        var lastRequest = res.req || req;
        if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && config.decompress !== false) {
          switch (res.headers["content-encoding"]) {
            case "gzip":
            case "compress":
            case "deflate":
              stream = stream.pipe(zlib.createUnzip());
              delete res.headers["content-encoding"];
              break;
          }
        }
        var response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config,
          request: lastRequest
        };
        if (config.responseType === "stream") {
          response.data = stream;
          settle(resolve, reject, response);
        } else {
          var responseBuffer = [];
          stream.on("data", function handleStreamData(chunk) {
            responseBuffer.push(chunk);
            if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
              stream.destroy();
              reject(createError("maxContentLength size of " + config.maxContentLength + " exceeded", config, null, lastRequest));
            }
          });
          stream.on("error", function handleStreamError(err) {
            if (req.aborted)
              return;
            reject(enhanceError(err, config, null, lastRequest));
          });
          stream.on("end", function handleStreamEnd() {
            var responseData = Buffer.concat(responseBuffer);
            if (config.responseType !== "arraybuffer") {
              responseData = responseData.toString(config.responseEncoding);
              if (!config.responseEncoding || config.responseEncoding === "utf8") {
                responseData = utils.stripBOM(responseData);
              }
            }
            response.data = responseData;
            settle(resolve, reject, response);
          });
        }
      });
      req.on("error", function handleRequestError(err) {
        if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS")
          return;
        reject(enhanceError(err, config, null, req));
      });
      if (config.timeout) {
        req.setTimeout(config.timeout, function handleRequestTimeout() {
          req.abort();
          reject(createError("timeout of " + config.timeout + "ms exceeded", config, "ECONNABORTED", req));
        });
      }
      if (config.cancelToken) {
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (req.aborted)
            return;
          req.abort();
          reject(cancel);
        });
      }
      if (utils.isStream(data)) {
        data.on("error", function handleStreamError(err) {
          reject(enhanceError(err, config, null, req));
        }).pipe(req);
      } else {
        req.end(data);
      }
    });
  };
});

// node_modules/axios/lib/defaults.js
var require_defaults2 = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var normalizeHeaderName = require_normalizeHeaderName();
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
      headers["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = require_xhr();
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = require_http();
    }
    return adapter;
  }
  var defaults = {
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, "Accept");
      normalizeHeaderName(headers, "Content-Type");
      if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, "application/json;charset=utf-8");
        return JSON.stringify(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
        }
      }
      return data;
    }],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };
  defaults.headers = {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  };
  utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });
  utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });
  module2.exports = defaults;
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var transformData = require_transformData();
  var isCancel = require_isCancel();
  var defaults = require_defaults2();
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }
  module2.exports = function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = config.headers || {};
    config.data = transformData(config.data, config.headers, config.transformRequest);
    config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
    utils.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
      delete config.headers[method];
    });
    var adapter = config.adapter || defaults.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData(response.data, response.headers, config.transformResponse);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
        }
      }
      return Promise.reject(reason);
    });
  };
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  module2.exports = function mergeConfig(config1, config2) {
    config2 = config2 || {};
    var config = {};
    var valueFromConfig2Keys = ["url", "method", "data"];
    var mergeDeepPropertiesKeys = ["headers", "auth", "proxy", "params"];
    var defaultToConfig2Keys = [
      "baseURL",
      "transformRequest",
      "transformResponse",
      "paramsSerializer",
      "timeout",
      "timeoutMessage",
      "withCredentials",
      "adapter",
      "responseType",
      "xsrfCookieName",
      "xsrfHeaderName",
      "onUploadProgress",
      "onDownloadProgress",
      "decompress",
      "maxContentLength",
      "maxBodyLength",
      "maxRedirects",
      "transport",
      "httpAgent",
      "httpsAgent",
      "cancelToken",
      "socketPath",
      "responseEncoding"
    ];
    var directMergeKeys = ["validateStatus"];
    function getMergedValue(target, source) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge(target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(void 0, config1[prop]);
      }
    }
    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(void 0, config2[prop]);
      }
    });
    utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(void 0, config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(void 0, config1[prop]);
      }
    });
    utils.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(void 0, config1[prop]);
      }
    });
    var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
    var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });
    utils.forEach(otherKeys, mergeDeepProperties);
    return config;
  };
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var buildURL = require_buildURL();
  var InterceptorManager = require_InterceptorManager();
  var dispatchRequest = require_dispatchRequest();
  var mergeConfig = require_mergeConfig();
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  Axios.prototype.request = function request(config) {
    if (typeof config === "string") {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }
    config = mergeConfig(this.defaults, config);
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = "get";
    }
    var chain = [dispatchRequest, void 0];
    var promise = Promise.resolve(config);
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  };
  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
  };
  utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    Axios.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data
      }));
    };
  });
  module2.exports = Axios;
});

// node_modules/axios/lib/cancel/Cancel.js
var require_Cancel = __commonJS((exports2, module2) => {
  "use strict";
  function Cancel(message) {
    this.message = message;
  }
  Cancel.prototype.toString = function toString() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel.prototype.__CANCEL__ = true;
  module2.exports = Cancel;
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS((exports2, module2) => {
  "use strict";
  var Cancel = require_Cancel();
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }
      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  };
  module2.exports = CancelToken;
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function isAxiosError(payload) {
    return typeof payload === "object" && payload.isAxiosError === true;
  };
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var bind = require_bind();
  var Axios = require_Axios();
  var mergeConfig = require_mergeConfig();
  var defaults = require_defaults2();
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);
    utils.extend(instance, Axios.prototype, context);
    utils.extend(instance, context);
    return instance;
  }
  var axios = createInstance(defaults);
  axios.Axios = Axios;
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };
  axios.Cancel = require_Cancel();
  axios.CancelToken = require_CancelToken();
  axios.isCancel = require_isCancel();
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = require_spread();
  axios.isAxiosError = require_isAxiosError();
  module2.exports = axios;
  module2.exports.default = axios;
});

// node_modules/axios/index.js
var require_axios2 = __commonJS((exports2, module2) => {
  module2.exports = require_axios();
});

// node_modules/@slack/webhook/dist/errors.js
var require_errors = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.httpErrorWithOriginal = exports2.requestErrorWithOriginal = exports2.ErrorCode = void 0;
  var ErrorCode;
  (function(ErrorCode2) {
    ErrorCode2["RequestError"] = "slack_webhook_request_error";
    ErrorCode2["HTTPError"] = "slack_webhook_http_error";
  })(ErrorCode = exports2.ErrorCode || (exports2.ErrorCode = {}));
  function errorWithCode(error, code) {
    const codedError = error;
    codedError.code = code;
    return codedError;
  }
  function requestErrorWithOriginal(original) {
    const error = errorWithCode(new Error(`A request error occurred: ${original.message}`), ErrorCode.RequestError);
    error.original = original;
    return error;
  }
  exports2.requestErrorWithOriginal = requestErrorWithOriginal;
  function httpErrorWithOriginal(original) {
    const error = errorWithCode(new Error(`An HTTP protocol error occurred: statusCode = ${original.response.status}`), ErrorCode.HTTPError);
    error.original = original;
    return error;
  }
  exports2.httpErrorWithOriginal = httpErrorWithOriginal;
});

// node_modules/@slack/webhook/package.json
var require_package2 = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "@slack/webhook",
    version: "6.0.0",
    description: "Official library for using the Slack Platform's Incoming Webhooks",
    author: "Slack Technologies, Inc.",
    license: "MIT",
    keywords: [
      "slack",
      "request",
      "client",
      "http",
      "api",
      "proxy"
    ],
    main: "dist/index.js",
    types: "./dist/index.d.ts",
    files: [
      "dist/**/*"
    ],
    engines: {
      node: ">= 12.13.0",
      npm: ">= 6.12.0"
    },
    repository: "slackapi/node-slack-sdk",
    homepage: "https://slack.dev/node-slack-sdk/webhook",
    publishConfig: {
      access: "public"
    },
    bugs: {
      url: "https://github.com/slackapi/node-slack-sdk/issues"
    },
    scripts: {
      prepare: "npm run build",
      build: "npm run build:clean && tsc",
      "build:clean": "shx rm -rf ./dist ./coverage ./.nyc_output",
      lint: "tslint --project .",
      test: "npm run build && nyc mocha --config .mocharc.json src/*.spec.js",
      coverage: "codecov -F webhook --root=$PWD",
      "ref-docs:model": "api-extractor run"
    },
    dependencies: {
      "@slack/types": "^1.2.1",
      "@types/node": ">=12.0.0",
      axios: "^0.21.1"
    },
    devDependencies: {
      "@microsoft/api-extractor": "^7.3.4",
      "@types/chai": "^4.1.7",
      "@types/mocha": "^5.2.6",
      chai: "^4.2.0",
      codecov: "^3.2.0",
      mocha: "^6.0.2",
      nock: "^10.0.6",
      nyc: "^14.1.1",
      shx: "^0.3.2",
      sinon: "^7.2.7",
      "source-map-support": "^0.5.10",
      "ts-node": "^8.0.3",
      tslint: "^5.13.1",
      "tslint-config-airbnb": "^5.11.1",
      typescript: "^4.1.0"
    }
  };
});

// node_modules/@slack/webhook/dist/instrument.js
var require_instrument = __commonJS((exports2) => {
  "use strict";
  var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.getUserAgent = exports2.addAppMetadata = void 0;
  var os = __importStar(require("os"));
  var packageJson = require_package2();
  function replaceSlashes(s) {
    return s.replace("/", ":");
  }
  var baseUserAgent = `${replaceSlashes(packageJson.name)}/${packageJson.version} node/${process.version.replace("v", "")} ${os.platform()}/${os.release()}`;
  var appMetadata = {};
  function addAppMetadata({name, version}) {
    appMetadata[replaceSlashes(name)] = version;
  }
  exports2.addAppMetadata = addAppMetadata;
  function getUserAgent() {
    const appIdentifier = Object.entries(appMetadata).map(([name, version]) => `${name}/${version}`).join(" ");
    return (appIdentifier.length > 0 ? `${appIdentifier} ` : "") + baseUserAgent;
  }
  exports2.getUserAgent = getUserAgent;
});

// node_modules/@slack/webhook/dist/IncomingWebhook.js
var require_IncomingWebhook = __commonJS((exports2) => {
  "use strict";
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.IncomingWebhook = void 0;
  var axios_1 = __importDefault(require_axios2());
  var errors_1 = require_errors();
  var instrument_1 = require_instrument();
  var IncomingWebhook2 = class {
    constructor(url, defaults = {}) {
      if (url === void 0) {
        throw new Error("Incoming webhook URL is required");
      }
      this.url = url;
      this.defaults = defaults;
      this.axios = axios_1.default.create({
        baseURL: url,
        httpAgent: defaults.agent,
        httpsAgent: defaults.agent,
        maxRedirects: 0,
        proxy: false,
        headers: {
          "User-Agent": instrument_1.getUserAgent()
        }
      });
      delete this.defaults.agent;
    }
    async send(message) {
      let payload = Object.assign({}, this.defaults);
      if (typeof message === "string") {
        payload.text = message;
      } else {
        payload = Object.assign(payload, message);
      }
      try {
        const response = await this.axios.post(this.url, payload);
        return this.buildResult(response);
      } catch (error) {
        if (error.response !== void 0) {
          throw errors_1.httpErrorWithOriginal(error);
        } else if (error.request !== void 0) {
          throw errors_1.requestErrorWithOriginal(error);
        } else {
          throw error;
        }
      }
    }
    buildResult(response) {
      return {
        text: response.data
      };
    }
  };
  exports2.IncomingWebhook = IncomingWebhook2;
});

// node_modules/@slack/webhook/dist/index.js
var require_dist = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.ErrorCode = exports2.IncomingWebhook = void 0;
  var IncomingWebhook_1 = require_IncomingWebhook();
  Object.defineProperty(exports2, "IncomingWebhook", {enumerable: true, get: function() {
    return IncomingWebhook_1.IncomingWebhook;
  }});
  var errors_1 = require_errors();
  Object.defineProperty(exports2, "ErrorCode", {enumerable: true, get: function() {
    return errors_1.ErrorCode;
  }});
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports2, module2) => {
  var fs = require("fs");
  var path = require("path");
  function log(message) {
    console.log(`[dotenv][DEBUG] ${message}`);
  }
  var NEWLINE = "\n";
  var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
  var RE_NEWLINES = /\\n/g;
  var NEWLINES_MATCH = /\n|\r|\r\n/;
  function parse(src, options) {
    const debug = Boolean(options && options.debug);
    const obj = {};
    src.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
      const keyValueArr = line.match(RE_INI_KEY_VAL);
      if (keyValueArr != null) {
        const key = keyValueArr[1];
        let val = keyValueArr[2] || "";
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          val = val.trim();
        }
        obj[key] = val;
      } else if (debug) {
        log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
      }
    });
    return obj;
  }
  function config(options) {
    let dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    let debug = false;
    if (options) {
      if (options.path != null) {
        dotenvPath = options.path;
      }
      if (options.encoding != null) {
        encoding = options.encoding;
      }
      if (options.debug != null) {
        debug = true;
      }
    }
    try {
      const parsed = parse(fs.readFileSync(dotenvPath, {encoding}), {debug});
      Object.keys(parsed).forEach(function(key) {
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
          process.env[key] = parsed[key];
        } else if (debug) {
          log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
        }
      });
      return {parsed};
    } catch (e) {
      return {error: e};
    }
  }
  module2.exports.config = config;
  module2.exports.parse = parse;
});

// chrome-web-store/check-for-updates.ts
var import_chrome_webstore = __toModule(require_client());
var import_webhook = __toModule(require_dist());

// chrome-web-store/lib/extensions.ts
require_main().config();
var extensions = [
  {
    name: "view-background-image",
    id: "cegndknljaapfbnmfnagomhhgbajjibd",
    slackWebhookUrl: process.env.VIEW_BACKGROUND_IMAGE_SLACK_WEBHOOK_URL
  },
  {
    name: "nicorepo-filter",
    id: "pcoahkcikijkecjcfclmoggolnocabfk",
    slackWebhookUrl: process.env.NICOREPO_FILTER_SLACK_WEBHOOK_URL
  },
  {
    name: "tweet-button-webext",
    id: "joolebahkfpcoapinfefhalfgjkpablf",
    slackWebhookUrl: process.env.TWEET_BUTTON_WEBEXT_SLACK_WEBHOOK_URL
  }
];

// chrome-web-store/lib/slack.ts
var reviewHeader = {
  type: "header",
  text: {
    type: "plain_text",
    text: "New review arrived"
  }
};
var issueHeader = {
  type: "header",
  text: {
    type: "plain_text",
    text: "New issue arrived"
  }
};
var formatDate = (timestamp) => new Date(timestamp).toLocaleDateString("ja", {timeZone: "Asia/Tokyo"});
var formatReview = ({
  rating,
  message,
  updated,
  author: {name}
}) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${":star:".repeat(rating)} by ${name} - ${formatDate(updated)}
${message}`
    }
  }
];
var formatIssue = ({
  title,
  description,
  browser,
  version,
  date,
  author: {name}
}) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:warning: *${title}* by ${name} - ${formatDate(date)}
${description}`
    }
  },
  {
    type: "context",
    elements: [
      {
        type: "plain_text",
        text: `Extension Version: ${version}
User Agent: ${browser}`
      }
    ]
  }
];

// chrome-web-store/check-for-updates.ts
(async () => {
  const lastExecution = Date.parse(process.argv[2]);
  if (isNaN(lastExecution)) {
    throw new Error(`Invalid argument: ${process.argv[2]}`);
  }
  const promises = extensions.map(async ({id, slackWebhookUrl}) => {
    const slack = new import_webhook.IncomingWebhook(slackWebhookUrl);
    const reviews = (await import_chrome_webstore.default.reviews({id, sort: "recent"})).filter((review) => review.updated > lastExecution);
    if (reviews.length) {
      await slack.send({
        blocks: [reviewHeader, ...reviews.flatMap(formatReview)]
      });
    }
    const issues = (await import_chrome_webstore.default.issues({id})).filter((issue) => issue.date > lastExecution);
    if (issues.length) {
      await slack.send({
        blocks: [issueHeader, ...issues.flatMap(formatIssue)]
      });
    }
  });
  await Promise.all(promises);
})().catch(async (error) => {
  const slack = new import_webhook.IncomingWebhook(process.env.GENERAL_SLACK_WEBHOOK_URL);
  await slack.send(`${error.name}: ${error.message}`);
});
