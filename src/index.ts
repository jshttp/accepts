/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
const Negotiator = require("negotiator");
const mime = require("mime-types");

/**
 * Create a new Accepts Class for the given req.
 *
 * @param {object} req
 * @public
 */

class Accepts {
  negotiator: any;
  headers: Headers | undefined;

  constructor(req: Request) {
    if(!(this instanceof Accepts)){
      return new Accepts(req);
    }
    
    this.headers = req.headers;
    this.negotiator = new Negotiator(req);
  }

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.types('html');
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     this.types('html');
   *     // => "html"
   *     this.types('text/html');
   *     // => "text/html"
   *     this.types('json', 'text');
   *     // => "json"
   *     this.types('application/json');
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     this.types('image/png');
   *     this.types('png');
   *     // => undefined
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.types(['html', 'json']);
   *     this.types('html', 'json');
   *     // => "json"
   *
   * @param {String|Array} types...
   * @return {String|Array|Boolean}
   * @public
   */

  types(types_: string | string[]): string | string[] | boolean {
    let types = types_;

    // support flattened arguments
    if (types && !Array.isArray(types)) {
      types = new Array(arguments.length);
      for (var i = 0; i < types.length; i++) {
        types[i] = arguments[i];
      }
    }

    // no types, return all requested types
    if (!types || types.length === 0) {
      return this.negotiator.mediaTypes();
    }

    // no accept header, return first given type
    if (!(this.headers && (this.headers as any).accept)) {
      return types[0];
    }

    var mimes = (types as string[]).map(extToMime);
    var accepts = this.negotiator.mediaTypes(mimes.filter(validMime));
    var first = accepts[0];

    return first ? types[mimes.indexOf(first)] : false;
  };

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   *
   * @param {String|Array} encodings...
   * @return {String|Array}
   * @public
   */
  encodings(encodings_: string | string[]): string | string[] {
    var encodings = encodings_;

    // support flattened arguments
    if (encodings && !Array.isArray(encodings)) {
      encodings = new Array(arguments.length);
      for (var i = 0; i < encodings.length; i++) {
        encodings[i] = arguments[i];
      }
    }

    // no encodings, return all requested encodings
    if (!encodings || encodings.length === 0) {
      return this.negotiator.encodings();
    }

    return this.negotiator.encodings(encodings)[0] || false;
  };

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   *
   * @param {String|Array} charsets...
   * @return {String|Array}
   * @public
   */
  charsets(charsets_: string | string[]): string | string[] {
    var charsets = charsets_;

    // support flattened arguments
    if (charsets && !Array.isArray(charsets)) {
      charsets = new Array(arguments.length);
      for (var i = 0; i < charsets.length; i++) {
        charsets[i] = arguments[i];
      }
    }

    // no charsets, return all requested charsets
    if (!charsets || charsets.length === 0) {
      return this.negotiator.charsets();
    }

    return this.negotiator.charsets(charsets)[0] || false;
  };

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   *
   * @param {String|Array} langs...
   * @return {Array|String}
   * @public
   */
  languages(languages_: string | string[]): string | string[] {
    var languages = languages_;

    // support flattened arguments
    if (languages && !Array.isArray(languages)) {
      languages = new Array(arguments.length);
      for (var i = 0; i < languages.length; i++) {
        languages[i] = arguments[i];
      }
    }

    // no languages, return all requested languages
    if (!languages || languages.length === 0) {
      return this.negotiator.languages();
    }

    return this.negotiator.languages(languages)[0] || false;
  };

  lang(languages_: string | string[]): string | string[] {
    return this.languages(languages_);
  };
}

/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */

function extToMime(type: string): string {
  return type.indexOf("/") === -1 ? mime.lookup(type) : type;
}

/**
 * Check if mime is valid.
 *
 * @param {String} type
 * @return {String}
 * @private
 */

function validMime(type: string): boolean {
  return typeof type === "string";
}

module.exports = function(req:Request){
  return new Accepts(req);
};
